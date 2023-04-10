import express, { NextFunction, Request, Response } from "express";
import { CreateVendor, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.get("/vendors", GetVendors);
router.post("/vendors", CreateVendor);
router.get("/vendors/:id", GetVendorByID);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from admin" });
});

export { router as AdminRoutes };
