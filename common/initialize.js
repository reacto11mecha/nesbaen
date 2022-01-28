import User from "../models/user.js";
import Class from "../models/class.js";
import getUsersData from "../utils/readALotXLSX.js";
import currentAvailableClass from "./availableClass.js";

const proceedUser = async () =>
  await User.find().then(async (data) => {
    if (data.length === 0) {
      const allUsers = await getUsersData();

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

export default initialize;
export { proceedUser, proceedClass };
