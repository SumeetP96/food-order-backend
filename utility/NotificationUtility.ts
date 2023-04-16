import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NO,
} from "../config";

// Email

// Notification

// OTP
export const GenerateOtp = () => {
  const otp = Math.floor(100000 * Math.random() * 900000);

  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const SendOtp = async (otp: number, toPhone: string) => {
  const accountSid = TWILIO_ACCOUNT_SID;
  const authToken = TWILIO_AUTH_TOKEN;
  const fromPhone = TWILIO_PHONE_NO;

  const client = require("twilio")(accountSid, authToken);
  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: fromPhone,
    to: `+91-${toPhone}`,
  });

  return response;
};

// Payment Notification or Emails
