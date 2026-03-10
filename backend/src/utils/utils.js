import crypto from "crypto";

export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

export function generateOTPExpiry() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  return now;
}

