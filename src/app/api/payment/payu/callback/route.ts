import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/dbConfig/dbConfig";
import PaymentAttempt from "@/models/PaymentAttempt";
import Subscription from "@/models/Subscriptionmodels";
import { PLAN_CONFIG } from "@/lib/plans";

connect();

function getSiteUrl(): string {
  const domain = process.env.DOMAIN || "";
  return domain.startsWith("http") ? domain : `https://${domain}`;
}

// Status 303 makes the browser open the next page with GET after PayU's POST
function backToPage(result: "success" | "failed") {
  return NextResponse.redirect(
    new URL(`/subscription/subscribe?payment=${result}`, getSiteUrl()),
    303
  );
}

// PayU sends the customer back here (POST) after the payment attempt.
// Nothing in this request is trusted until the hash check passes.
export async function POST(request: NextRequest) {
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;

  if (!key || !salt) {
    return backToPage("failed");
  }

  try {
    const form = await request.formData();
    const get = (name: string) => String(form.get(name) ?? "");

    const txnid = get("txnid");
    const status = get("status");
    const amount = get("amount");
    const email = get("email");
    const firstname = get("firstname");
    const productinfo = get("productinfo");
    const mihpayid = get("mihpayid");
    const additionalCharges = get("additionalCharges");

    // Step 1: re-compute PayU's response hash and compare it
    // sha512(salt|status|udf10..udf1 (empty)|email|firstname|productinfo|amount|txnid|key)
    let hashString = [
      salt, status,
      "", "", "", "", "", "", "", "", "", "",
      email, firstname, productinfo, amount, txnid, key,
    ].join("|");
    if (additionalCharges) {
      hashString = `${additionalCharges}|${hashString}`;
    }
    const expectedHash = crypto.createHash("sha512").update(hashString).digest("hex");

    const givenBuffer = Buffer.from(get("hash").toLowerCase());
    const expectedBuffer = Buffer.from(expectedHash);

    if (
      givenBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(givenBuffer, expectedBuffer)
    ) {
      console.log("PayU callback: hash mismatch for", txnid);
      return backToPage("failed");
    }

    // Step 2: find the payment attempt saved before the customer left our site
    const attempt = await PaymentAttempt.findOne({ txnid, gateway: "payu" });
    if (!attempt) {
      console.log("PayU callback: unknown txnid", txnid);
      return backToPage("failed");
    }

    // Step 3: the payment must be successful and the amount must match our record
    if (status !== "success") {
      await PaymentAttempt.updateOne({ _id: attempt._id, status: "Created" }, { status: "Failed" });
      return backToPage("failed");
    }

    if (Number(amount) !== attempt.amount) {
      console.log("PayU callback: amount mismatch for", txnid);
      await PaymentAttempt.updateOne({ _id: attempt._id, status: "Created" }, { status: "Failed" });
      return backToPage("failed");
    }

    // Step 4: claim the attempt exactly once (stops a replayed response from
    // creating a second subscription)
    const claimed = await PaymentAttempt.findOneAndUpdate(
      { _id: attempt._id, status: "Created" },
      { status: "Success", gatewayPaymentId: mihpayid }
    );

    if (!claimed) {
      return backToPage(attempt.status === "Success" ? "success" : "failed");
    }

    // Step 5: create the subscription from the saved attempt, not from the browser
    const config = PLAN_CONFIG[attempt.planType as keyof typeof PLAN_CONFIG];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + config.months);

    try {
      await Subscription.create({
        user: attempt.user,
        state: attempt.state,
        district: attempt.district,
        planType: attempt.planType,
        amount: config.amount,
        startDate,
        endDate,
        status: "Active",
        propertyLimit: config.propertyLimit,
        propertiesAddedCount: 0,
        paymentReference: mihpayid || txnid,
      });
    } catch (error: any) {
      // Give the attempt back so a retry from PayU can still finish the job
      console.log("PayU callback: subscription not created:", error?.message || error);
      await PaymentAttempt.updateOne({ _id: attempt._id }, { status: "Created" });
      return backToPage("failed");
    }

    return backToPage("success");
  } catch (error: any) {
    console.log("PayU callback error:", error?.message || error);
    return backToPage("failed");
  }
}