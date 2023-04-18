import { NextFunction, Request, Response } from "express";
import { Food, Vendor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;

    const results = await Vendor.find({
      pincode: pincode,
      serviceAvailable: false,
    })
      .sort({ ratings: -1 })
      .populate("foods");

    if (results.length > 0) {
      return res.status(200).json(results);
    }

    return res.status(400).json({ message: "Data not found!" });
  } catch (e) {
    next(e);
  }
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;

    const results = await Vendor.find({
      pincode: pincode,
      serviceAvailable: false,
    })
      .sort({ ratings: -1 })
      .limit(1);

    if (results.length > 0) {
      return res.status(200).json(results);
    }

    return res.status(400).json({ message: "Data not found!" });
  } catch (e) {
    next(e);
  }
};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;

    const results = await Food.aggregate([
      {
        $match: {
          readyTime: { $lte: 30 },
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: "$vendor",
      },
      {
        $match: {
          "vendor.pincode": pincode,
          "vendor.serviceAvailable": false,
        },
      },
      {
        $unset: ["__v", "createdAt", "updatedAt", "vendor"],
      },
    ]);

    if (results.length > 0) {
      return res.status(200).json(results);
    }

    return res.status(400).json({ message: "Data not found!" });
  } catch (e) {
    next(e);
  }
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;

    const results = await Food.aggregate([
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: "$vendor",
      },
      {
        $match: {
          "vendor.pincode": pincode,
          "vendor.serviceAvailable": false,
        },
      },
      {
        $unset: ["__v", "createdAt", "updatedAt", "vendor"],
      },
    ]);

    if (results.length > 0) {
      return res.status(200).json(results);
    }

    return res.status(400).json({ message: "Data not found!" });
  } catch (e) {
    next(e);
  }
};

export const GetRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const restaurant = await Vendor.findById(id).populate("foods");

    if (restaurant) {
      return res.status(200).json(restaurant);
    }

    return res.status(400).json({ message: "Restaurant not found!" });
  } catch (e) {
    next(e);
  }
};
