import express, { NextFunction, Request, Response } from "express";
import { CreateVendor, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.get("/vendor", GetVendors);
router.post("/vendor", CreateVendor);
router.get("/vendor/:id", GetVendorByID);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from admin" });
});

export { router as AdminRoutes };