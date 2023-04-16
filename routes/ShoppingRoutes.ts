import express from "express";
import {
  GetFoodAvailability,
  GetFoodIn30Min,
  GetRestaurantById,
  GetTopRestaurants,
  SearchFoods,
} from "../controllers";

const router = express.Router();

// Food Availability
router.get("/:pincode", GetFoodAvailability);

// Top Restaurants
router.get("/top-restaurants/:pincode", GetTopRestaurants);

// Food available in 30 minutes
router.get("/food-in-30-min/:pincode", GetFoodIn30Min);

// Search Foods
router.get("/search/:pincode", SearchFoods);

// Find Restaurant by Id
router.get("/restaurant/:id", GetRestaurantById);

export { router as ShoppingRoutes };
