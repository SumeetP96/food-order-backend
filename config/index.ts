import { config } from "dotenv";

config();

export const MONGO_URI = process.env.MONGO_ATLAS_URI;
