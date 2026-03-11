import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
