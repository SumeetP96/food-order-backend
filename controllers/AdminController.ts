import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const CreateVendor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const reqBody = <CreateVendorInput>req.body;

    const existingVendor = await Vendor.findOne({ email: reqBody.email });
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
};

export const GetVendors = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

export const GetVendorByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};
