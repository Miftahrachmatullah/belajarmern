import express from "express";
import bodyParser from "body-parser";

import router from "../src/routes/api";
import db from "../src/utils/database";

const app = express();

app.use(bodyParser.json());

let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    await db();
    isConnected = true;
    console.log("Database connected");
  }
};

app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    next(error);
  }
});

app.use("/api", router);

export default app;