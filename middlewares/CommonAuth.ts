import { NextFunction, Request, Response } from "express";
import { ValidateSignature } from "../utility";

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validSignature = ValidateSignature(req);
  if (validSignature) {
    next();
  } else {
    return res.json({ message: "Not authorized!" });
  }
};
