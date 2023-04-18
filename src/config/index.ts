import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 8000;

export const MONGO_URI = process.env.MONGO_ATLAS_URI || "";

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRE = process.env.JWT_EXPIRE;

export const TWILIO_PHONE_NO = process.env.TWILIO_PHONE_NO;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
