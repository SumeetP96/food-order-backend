import express, { NextFunction, Request, Response } from "express";
import {
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from "../controllers";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from vendor" });
});
router.post("/login", VendorLogin);
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/service", UpdateVendorService);

export { router as VendorRoutes };
