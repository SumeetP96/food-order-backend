import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CreateCustomerInput } from "../dto";
import { Customer } from "../models";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  SendOtp,
} from "../utility";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const inputErrors = await validate(customerInputs, {
      validationError: { target: true },
    });
    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = req.body;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const createdCustomer = await Customer.create({
      email: email,
      password: userPassword,
      phone: phone,
      salt: salt,
      otp: otp,
      otpExpiry: expiry,
      firstName: "",
      lastName: "",
      address: "",
      verified: false,
      lat: 0,
      lng: 0,
    });

    if (createdCustomer) {
      await SendOtp(otp, phone);

      const signature = GenerateSignature({
        _id: createdCustomer._id,
        email: createdCustomer.email,
        verified: createdCustomer.verified,
      });

      return res.status(201).json({
        signature,
        verified: createdCustomer.verified,
        email: createdCustomer.email,
      });
    }

    return res.status(400).json({ message: "Error while signing up!" });
  } catch (e: any) {
    console.log(e.message);
    next(e);
  }
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
