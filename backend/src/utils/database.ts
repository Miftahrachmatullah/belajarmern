import mongoose from "mongoose";

import { DATABASE_URL } from "./env";

import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db_acara",
    });

    return "Database connected";
  } catch (error) {
    throw error;
  }
};

export default connect;