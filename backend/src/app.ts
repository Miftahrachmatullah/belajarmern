import express from "express";
import bodyParser from "body-parser";

import router from "./routes/api";

const app = express();

app.use(bodyParser.json());

app.use("/api", router);

export default app;