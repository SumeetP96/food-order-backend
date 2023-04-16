import bodyParser from "body-parser";
import express, { Application } from "express";
import path from "path";

import {
  AdminRoutes,
  CustomerRoutes,
  ShoppingRoutes,
  VendorRoutes,
} from "../routes";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("./images/", express.static(path.join(__dirname, "images")));

  app.use("/admin", AdminRoutes);
  app.use("/vendor", VendorRoutes);
  app.use("/shopping", ShoppingRoutes);
  app.use("/customer", CustomerRoutes);

  return app;
};
