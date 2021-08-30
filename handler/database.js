import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/user.js";
import Class from "../models/class.js";
import getUsersData from "../utils/readALotXLSX.js";

dotenv.config();

const SUBJECTS = ["IPA", "IPS", "BAHASA"];

const createGradeClass = (length, subjectIDX) => {
  if (length > 1) {
    const dummyArray = Array.from(new Array(length));

    return dummyArray.map((_, idx) => ({
      name: `${SUBJECTS[subjectIDX]} ${++idx}`,
    }));
  }

  return { name: `${SUBJECTS[subjectIDX]}` };
};

const currentAvailableClass = [
  {
    gradeName: "X",
    classNames: [
      ...createGradeClass(6, 0),
      ...createGradeClass(4, 1),
      createGradeClass(1, 2),
    ],
  },
];

const getRemappedUser = async () => {
  let penampung = [];
  const data = await getUsersData();

  data.forEach((item) => {
    penampung = [...penampung, ...item];
  });

  return penampung;
};

const proceedUser = async () =>
  await User.find().then(async (data) => {
    if (data.length === 0) {
      const allUsers = await getRemappedUser();

      User.insertMany(allUsers)
        .then(() => console.log("[DB] User ditambahkan"))
        .catch((e) => {
          console.error(`Error: ${e}`);
          process.exit();
        });
    }
  });

const proceedClass = async () =>
  await Class.find().then(async (data) => {
    if (data.length === 0) {
      for (const currentClass of currentAvailableClass) {
        const newGrade = new Class({ ...currentClass });
        newGrade.classNames = currentClass.classNames;

        await newGrade.save();
      }

      console.log("[DB] Kelas ditambahkan");
    }
  });

const initialize = async () => {
  await proceedClass();
  await proceedUser();
  console.log("[DB] Prosedur inisialisasi selesai");
};

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
