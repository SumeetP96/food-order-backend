import { NextFunction, Request, Response } from "express";
import {
  CreateFoodInput,
  EditVendorInput,
  EditVendorService,
  VendorLoginInput,
  VendorPayload,
} from "../dto";
import { Food, Order } from "../models";
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

export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );

    if (orders.length) {
      return res.status(200).json({ orders });
    }
  }

  return res.status(400).json({ message: "Orders not found!" });
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  const { status, remarks, time } = req.body;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }

    const updatedOrder = await order.save();

    if (updatedOrder) {
      return res.status(200).json({ order: updatedOrder });
    }
  }

  return res.status(400).json({ message: "Unable to process order!" });
};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order) {
      return res.status(200).json({ order });
    }
  }

  return res.status(400).json({ message: "Order not found!" });
};
