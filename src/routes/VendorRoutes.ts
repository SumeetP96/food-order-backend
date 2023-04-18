import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import {
  CreateFood,
  GetFoods,
  GetVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "images");
  },
  filename(req, file, callback) {
    const uniqueSuffix =
      Date.now() +
      "_" +
      Math.round(Math.random() * 1e9) +
      "_" +
      file.originalname;
    callback(null, uniqueSuffix);
  },
});

const images = multer({ storage }).array("images", 10);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from vendor" });
});

router.post("/login", VendorLogin);

router.use(Authenticate);
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/service", UpdateVendorService);
router.patch("/coverimage", images, UpdateVendorCoverImage);
router.get("/foods", GetFoods);
router.post("/foods", images, CreateFood);

export { router as VendorRoutes };
