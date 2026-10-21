import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import userModels from "@/models/userModels";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const fromAddress = `"Trade My Property" <${process.env.MAIL_USER}>`;

    if (emailType === "VERIFY") {
      const otp = generateOTP();

      await userModels.findByIdAndUpdate(userId, {
        VerifyToken: otp,
        VerifyTokenExpiry: Date.now() + 600000, // valid for 10 minutes
      });

      const mailOptions = {
        from: fromAddress,
        to: email,
        subject: "Your Trade My Property verification code",
        text: `Your verification code is ${otp}. It is valid for 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #222;">
            <h2>Verify your email</h2>
            <p>Your verification code is:</p>
            <h2 style="letter-spacing: 4px;">${otp}</h2>
            <p>This code is valid for 10 minutes.</p>
            <p>If you did not request this, you can ignore this email.</p>
          </div>
        `,
      };

      return await transporter.sendMail(mailOptions);
    } else if (emailType === "RESET") {
      const hashedToken = await bcryptjs.hash(userId.toString(), 10);

      await userModels.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // valid for 1 hour
      });

      const link = `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

      const mailOptions = {
        from: fromAddress,
        to: email,
        subject: "Reset your Trade My Property password",
        text: `Reset your Trade My Property password using this link: ${link}\n\nThis link is valid for 1 hour. It resets your Trade My Property password only. It does not change your email password.\n\nIf you did not request this, you can ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #222;">
            <h2>Reset your password</h2>
            <p>We received a request to reset your Trade My Property password.</p>
            <p>
              <a href="${link}" style="display: inline-block; padding: 12px 24px; background: #ea580c; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset Password
              </a>
            </p>
            <p>This link is valid for 1 hour. It resets your Trade My Property password only. It does not change your email password.</p>
            <p>If you did not request this, you can ignore this email.</p>
          </div>
        `,
      };

      return await transporter.sendMail(mailOptions);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};