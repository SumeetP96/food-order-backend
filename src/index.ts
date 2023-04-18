import express from "express";
import { PORT } from "./config";
import DatabaseConnection from "./services/DatabaseConnection";
import ExpressApp from "./services/ExpressApp";

const StartServer = async () => {
  const app = express();

  await ExpressApp(app);
  await DatabaseConnection();

  app.listen(PORT, () => {
    console.log(`Application is running on port: ${PORT}`);
  });
};

StartServer();
