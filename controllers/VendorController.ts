import { NextFunction, Request, Response } from "express";
import { VendorLoginInput, VendorPayload } from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVendor } from "./AdminController";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = <VendorLoginInput>req.body;

    const existingVendor = await FindVendor({ email });

    if (existingVendor) {
      const passwordValid = await ValidatePassword(
        password,
        existingVendor.password
      );

      if (passwordValid) {
        const signature = GenerateSignature(
          <VendorPayload>existingVendor.toJSON()
        );
        return res.json({ user: existingVendor, signature });
      }
    }

    return res.json({ message: "Invalid credentials!" });
  } catch (e) {
    next(e);
  }
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
