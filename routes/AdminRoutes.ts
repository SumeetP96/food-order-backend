import express, { NextFunction, Request, Response } from "express";
import { CreateVendor, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.get("/vendors", GetVendors);
router.post("/vendors", CreateVendor);
router.get("/vendors/:id", GetVendorByID);

export { router as AdminRoutes };
