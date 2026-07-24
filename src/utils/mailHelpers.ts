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

    if (emailType === "VERIFY") {
      const otp = generateOTP();

      await userModels.findByIdAndUpdate(userId, {
        VerifyToken: otp,
        VerifyTokenExpiry: Date.now() + 600000, // 10 minute ke liye valid
      });

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Verify your email - OTP",
        html: `<p>Aapka verification OTP hai:</p><h2 style="letter-spacing: 4px;">${otp}</h2><p>Yah OTP 10 minute ke liye valid hai.</p>`,
      };

      return await transporter.sendMail(mailOptions);
    } else if (emailType === "RESET") {
      const hashedToken = await bcryptjs.hash(userId.toString(), 10);

      await userModels.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });

      const link = `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${link}">here</a> to reset your password</p>`,
      };

      return await transporter.sendMail(mailOptions);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};