import express from "express";
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  GetCustomerProfile,
  RequestOtp,
  UpdateCustomerProfile,
} from "../controllers";

const router = express.Router();

// Signup / Create Customer
router.post("/signup", CustomerSignUp);

// Login
router.post("/login", CustomerLogin);

// Verify customer account

router.patch("/verify", CustomerVerify);
// OTP / Requesting OTP
router.get("/otp", RequestOtp);

// Profile
router.get("/profile", GetCustomerProfile);
router.patch("/profile", UpdateCustomerProfile);

// Cart
// Order
// Payment

export { router as CustomerRoutes };
