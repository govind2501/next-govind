import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { sendEmail } from "@/helpers/mailHelper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { name, email, phone, message } = reqBody;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    // Find all admin users to notify
    const admins = await User.find({ isAdmin: true }).select("email");

    const emailHtml = `
      <h2>New Contact Us Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "(not provided)"}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    for (const admin of admins) {
      await sendEmail({
        email: admin.email,
        subject: `Trade My Property - Contact Us Message from ${name}`,
        html: emailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent. We'll get back to you soon!",
    });

  } catch (error: any) {
    console.log("Contact form error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}