import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import userModels from "@/models/userModels";
import PaymentAttempt from "@/models/PaymentAttempt";
import { PLAN_CONFIG } from "@/lib/plans";

connect();

// PayU payment page address: test server while testing, live server in production
const PAYU_TEST_URL = "https://test.payu.in/_payment";
const PAYU_LIVE_URL = "https://secure.payu.in/_payment";

function getSiteUrl(): string {
  const domain = process.env.DOMAIN || "";
  return domain.startsWith("http") ? domain : `https://${domain}`;
}

export async function POST(request: NextRequest) {
  // Step 1: find out who is buying (not logged in -> 401)
  let userId: string;
  try {
    userId = await getDataFromToken(request);
  } catch {
    return NextResponse.json({ error: "Please log in again" }, { status: 401 });
  }

  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const mode = process.env.PAYU_MODE === "live" ? "live" : "test";

  if (!key || !salt) {
    return NextResponse.json(
      { error: "Online payment is not available yet. Please contact us to subscribe." },
      { status: 503 }
    );
  }

  // Safety: never accept PayU TEST payments on the live website
  if (process.env.NODE_ENV === "production" && mode === "test") {
    return NextResponse.json(
      { error: "Online payment is not available yet. Please contact us to subscribe." },
      { status: 503 }
    );
  }

  try {
    // Step 2: read and validate the request. The price comes from the server.
    const { state, district, planType } = await request.json();

    if (!state || !district || !planType) {
      return NextResponse.json(
        { error: "State, District and Plan Type are all required" },
        { status: 400 }
      );
    }

    const config = PLAN_CONFIG[planType as keyof typeof PLAN_CONFIG];
    if (!config) {
      return NextResponse.json(
        { error: "Plan Type can only be 'Monthly', 'Quarterly' or 'Yearly'" },
        { status: 400 }
      );
    }

    // Step 3: customer details come from the database, not from the browser
    const user: any = await userModels.findById(userId).select("username email");
    if (!user) {
      return NextResponse.json({ error: "Please log in again" }, { status: 401 });
    }

    const firstname =
      String(user.username || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 30) || "Customer";
    const email = String(user.email);

    // Step 4: save the payment attempt BEFORE sending the customer to PayU
    const txnid = `TMP${Date.now()}${crypto.randomBytes(4).toString("hex")}`;
    const amount = config.amount.toFixed(2);
    const productinfo = "Subscription";

    await PaymentAttempt.create({
      txnid,
      gateway: "payu",
      user: userId,
      state,
      district,
      planType,
      amount: config.amount,
    });

    // Step 5: PayU hash = sha512(key|txnid|amount|productinfo|firstname|email|udf1..udf10 (empty)|salt)
    const hashString = [
      key, txnid, amount, productinfo, firstname, email,
      "", "", "", "", "", "", "", "", "", "",
      salt,
    ].join("|");
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const siteUrl = getSiteUrl();

    return NextResponse.json({
      action: mode === "live" ? PAYU_LIVE_URL : PAYU_TEST_URL,
      fields: {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        surl: `${siteUrl}/api/payment/payu/callback`,
        furl: `${siteUrl}/api/payment/payu/callback`,
        hash,
      },
    });
  } catch (error: any) {
    console.log("PayU start error:", error?.message || error);
    return NextResponse.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 }
    );
  }
}