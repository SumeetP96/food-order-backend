import { NextFunction, Request, Response } from "express";
import {
  CreateFoodInput,
  EditVendorInput,
  EditVendorService,
  VendorLoginInput,
  VendorPayload,
} from "../dto";
import { Food } from "../models";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVendor } from "./AdminController";
import { Types } from "mongoose";

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
  try {
    const user = req.user;

    if (user) {
      const existingVendor = await FindVendor({
        id: new Types.ObjectId(user._id),
      });

      return res.json(existingVendor);
    }

    return res.json({ message: "Vendor not found!" });
  } catch (e) {
    next(e);
  }
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const existingVendor = await FindVendor({
        id: new Types.ObjectId(user._id),
      });

      if (existingVendor) {
        const files = req.files as [Express.Multer.File];
        const images = files.map((file: Express.Multer.File) => file.filename);

        existingVendor.coverImages.push(...images);
        const updatedVendor = await existingVendor.save();

        return res.json({ vendor: updatedVendor });
      }
    }

    return res.json({ message: "Error creating food!" });
  } catch (e) {
    next(e);
  }
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const { name, address, phone, foodTypes } = <EditVendorInput>req.body;

      const existingVendor = await FindVendor({
        id: new Types.ObjectId(user._id),
      });

      if (existingVendor) {
        existingVendor.name = name;
        existingVendor.address = address;
        existingVendor.phone = phone;
        existingVendor.foodTypes = foodTypes;

        const updatedVendor = await existingVendor.save();

        return res.json(updatedVendor);
      }
    }

    return res.json({ message: "Vendor not found!" });
  } catch (e) {
    next(e);
  }
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const { serviceAvailable } = <EditVendorService>req.body;

      const existingVendor = await FindVendor({
        id: new Types.ObjectId(user._id),
      });

      if (existingVendor) {
        existingVendor.serviceAvailable = serviceAvailable;

        const updatedVendor = await existingVendor.save();

        return res.json(updatedVendor);
      }
    }

    return res.json({ message: "Vendor not found!" });
  } catch (e) {
    next(e);
  }
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const foods = await Food.find({ vendorId: user._id });

      if (foods.length) {
        return res.json(foods);
      }
    }

    return res.json({ message: "Error getting foods!" });
  } catch (e) {
    next(e);
  }
};

export const CreateFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const { name, description, category, foodType, readyTime, price } = <
        CreateFoodInput
      >req.body;

      const existingVendor = await FindVendor({
        id: new Types.ObjectId(user._id),
      });

      if (existingVendor) {
        const files = req.files as [Express.Multer.File];
        const images = files.map((file: Express.Multer.File) => file.filename);

        const createdFood = await Food.create({
          vendorId: existingVendor._id,
          name,
          description,
          category,
          foodType,
          readyTime,
          price,
          images,
          rating: 0,
        });

        existingVendor.foods.push(createdFood);
        const updatedVendor = await existingVendor.save();

        return res.json({ food: createdFood, vendor: updatedVendor });
      }
    }

    return res.json({ message: "Error creating food!" });
  } catch (e) {
    next(e);
  }
};
