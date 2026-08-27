import app from "../src/app.js";
import db from "../src/utils/database.js";
import type { Request, Response, NextFunction } from "express";

let isConnected = false;

app.use(
  async (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      if (!isConnected) {
        await db();
        isConnected = true;

        console.log("Database connected");
      }

      next();
    } catch (error) {
      console.error("Database connection error:", error);
      next(error);
    }
  }
);

export default app;