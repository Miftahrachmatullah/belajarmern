import express from "express";
import bodyParser from "body-parser";
import router from "./routes/api.js";

const app = express();

app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Belajar MERN API is running",
  });
});

app.use("/api", router);

export default app;