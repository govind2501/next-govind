import { connect } from "@/dbConfig/dbConfig";
import Feedback from "@/models/feedbackmodels";
import User from "@/models/userModels";
import { sendEmail } from "@/helpers/mailHelper";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { visitorId, page, reason, message } = reqBody;

    if (!visitorId || !page || !reason) {
      return NextResponse.json(
        { error: "visitorId, page and reason are required" },
        { status: 400 }
      );
    }

    let userId: string | null = null;
    try {
      userId = await getDataFromToken(request);
    } catch (err) {
      userId = null;
    }

    const newFeedback = new Feedback({
      user: userId,
      visitorId,
      page,
      reason,
      message: message || "",
    });

    await newFeedback.save();

    // ---- Notify Admin by email ----
    try {
      const admins = await User.find({ isAdmin: true }).select("email");

      const emailHtml = `
        <h2>New Website Feedback</h2>
        <p><strong>Page:</strong> ${page}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Message:</strong> ${message || "(no message provided)"}</p>
      `;

      // Send an email to every admin found in the database
      for (const admin of admins) {
        await sendEmail({
          email: admin.email,
          subject: "New Feedback Received - Trade My Property",
          html: emailHtml,
        });
      }
    } catch (emailError: any) {
      // Don't fail the whole request if the email fails to send
      console.log("Feedback email error:", emailError.message);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback!",
    });

  } catch (error: any) {
    console.log("Feedback submit error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}