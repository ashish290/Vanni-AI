import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
});

console.log("📧 Starting email server verification...");
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email server error:", error.message);
  } else {
    console.log("✅ Email server is ready");
  }
});

export default transporter;
