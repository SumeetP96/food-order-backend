import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import { MONGO_URI } from "./config";
import { AdminRoutes, VendorRoutes } from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", AdminRoutes);
app.use("/vendor", VendorRoutes);

try {
  mongoose.connect(MONGO_URI);
} catch (e) {
  console.log(e);
}

app.listen(8000, () => {
  console.log("Application is running on port: 8000");
});
