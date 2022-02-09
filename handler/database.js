import mongoose from "mongoose";
import dotenv from "dotenv";

import initialize from "../common/initialize.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("DB CONNECTED");
    await initialize();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
