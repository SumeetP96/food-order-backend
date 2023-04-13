import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { VendorPayload } from "../dto";
import { JWT_EXPIRE, JWT_SECRET } from "../config";
import { Request } from "express";
import { AuthPayload } from "../dto/Auth.dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string
) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

export const GenerateSignature = (payload: VendorPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const ValidateSignature = (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = jwt.verify(signature, JWT_SECRET) as AuthPayload;
    req.user = payload;
    return true;
  }
  return false;
};
