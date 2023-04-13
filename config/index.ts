import { config } from "dotenv";

config();

export const MONGO_URI = process.env.MONGO_ATLAS_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRE = process.env.JWT_EXPIRE;
