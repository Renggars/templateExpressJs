import nodemailer from "nodemailer";

const smtpConfig = {
  host: "smtp.example.com",
  port: 587,
  secure: false, // true untuk port 465, false untuk 587
  auth: {
    user: "your-email@example.com",
    pass: "your-password",
  },
  from: "your-email@example.com",
};

const emailFrom = "your-email@example.com";

const transport = nodemailer.createTransport(smtpConfig);

if (process.env.NODE_ENV !== "test") {
  transport
    .verify()
    .then(() => console.log("Connected to email server"))
    .catch(() =>
      console.warn(
        "Unable to connect to email server. Check SMTP config and internet connection."
      )
    );
}

/**
 * Kirim email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: emailFrom, to, subject, text };
  const res = await transport.sendMail(msg);
  console.log(res, "RESPONSE EMAIL");
};

/**
 * Kirim email reset password
 * @param {string} to
 * @param {string} token
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset Password";
  const resetPasswordUrl = `http://your-frontend-url.com/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Kirim email verifikasi
 * @param {string} to
 * @param {string} token
 */
const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  const verificationUrl = `http://your-frontend-url.com/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export { transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail };
