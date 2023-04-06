import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { AdminRoutes, VendorRoutes } from "./routes";
import { MONGO_URI } from "./config";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", AdminRoutes);
app.use("/vendor", VendorRoutes);

try {
    mongoose.connect(MONGO_URI || "");
} catch (e) {
    console.log(e);
}

app.listen(8000, () => {
    console.log("Application is running on port: 8000");
});
