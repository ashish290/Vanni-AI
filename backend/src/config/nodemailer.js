import nodemailer from "nodemailer";
import dns from "dns";

// Force IPv4 resolution to avoid ENETUNREACH on IPv6 addresses
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
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
