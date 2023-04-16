import express from "express";
import ExpressApp from "./services/ExpressApp";
import DatabaseConnection from "./services/DatabaseConnection";

const StartServer = async () => {
  const app = express();

  await ExpressApp(app);
  await DatabaseConnection();

  app.listen(8000, () => {
    console.log("Application is running on port: 8000");
  });
};

StartServer();
