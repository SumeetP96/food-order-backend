import express from "express";
import {
  AddToCart,
  CreateOrder,
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  DeleteCart,
  GetCart,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
  UpdateCustomerProfile,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/signup", CustomerSignUp);
router.post("/login", CustomerLogin);

router.use(Authenticate);
router.patch("/verify", CustomerVerify);
router.patch("/otp", RequestOtp);

// Profile
router.get("/profile", GetCustomerProfile);
router.patch("/profile", UpdateCustomerProfile);

// Cart
router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

// Order
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/orders/:id", GetOrderById);

// Payment

export { router as CustomerRoutes };
