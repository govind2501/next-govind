import nodemailer from "nodemailer";


export const sendEmail = async ({
    email,
    emailType,
    userId,
}: any) => {

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            // host: process.env.MAIL_HOST,
            //port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your Email"
                    : "Reset Password",
            html: `<h2>Hello</h2>`,
        };

        const mailResponse = await transporter.sendMail(mailOptions);

        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
};