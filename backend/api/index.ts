import app from "../src/app.js";
import db from "../src/utils/database.js";

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

export default app;