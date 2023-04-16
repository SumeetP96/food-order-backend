import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVendor = async (vendor: {
  id?: string | undefined;
  email?: string;
}) => {
  const { id, email } = vendor;
  if (email) {
    return await Vendor.findOne({ email: email });
  }
  return await Vendor.findById(id);
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqBody = <CreateVendorInput>req.body;

    const existingVendor = await FindVendor({ email: reqBody.email });
    if (existingVendor) {
      return res.json({ message: "Vendor with this email already exists!" });
    }

    // Encrypt password
    const salt = await GenerateSalt();
    const password = await GeneratePassword(reqBody.password, salt);

    const newVendor = await Vendor.create({
      ...reqBody,
      salt,
      password,
    });

    return res.json(newVendor);
  } catch (e) {
    next(e);
  }
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await Vendor.find();

    if (vendors !== null) {
      return res.json(vendors);
    }

    return res.json({ message: "Vendors not found!" });
  } catch (e) {
    next(e);
  }
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const vendor = await FindVendor({ id });

    if (vendor !== null) {
      return res.json(vendor);
    }

    return res.json({ message: "Vendor with the given id not found!" });
  } catch (e) {
    next(e);
  }
};
