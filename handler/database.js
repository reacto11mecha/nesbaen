import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/user.js";
import getUsersData from "../utils/readALotXLSX.js";

dotenv.config();

const getRemappedUser = async () => {
  let penampung = [];
  const data = await getUsersData();

  const remapped = data.map(({ data, className }) =>
    data.map((newData) => ({ ...newData, className }))
  );

  remapped.forEach((item) => {
    penampung = [...penampung, ...item];
  });

  return penampung;
};

const initialize = () =>
  User.find().then(async (data) => {
    if (data.length === 0) {
      const allUsers = await getRemappedUser();

      User.insertMany(allUsers)
        .then(() => console.log("User ditambahkan"))
        .catch((e) => {
          console.error(`Error: ${e}`);
          process.exit();
        });
    }
  });

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async (db) => {
    console.log("DB CONNECTED");
    await initialize();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
