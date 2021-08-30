import parsePhoneNumber from "libphonenumber-js";
import { NameRegex, xlsxSheetSplitter } from "../utils/regex.js";

const { isPossiblePhoneNumber, isValidPhoneNumber } = parsePhoneNumber;

const teacherSorter = (reject) => (d) => {
  const keys = Object.keys(d);

  if (!keys.includes("NAMA GURU") | !keys.includes("NO TELEPON"))
    reject(
      `Format tidak sesuai. Judul data harus menggunakan "NAMA GURU", "NO TELEPON". File: ${file}`
    );

  const reformatted = {
    name: d["NAMA GURU"]
      .toLowerCase()
      .trim()
      .replace(/\b(\w)/g, (s) => s.toUpperCase()),
    phoneNumber: d["NO TELEPON"].trim().replace(".", "+"),
    roles: ["guru"],
  };

  if (
    !isPossiblePhoneNumber(reformatted.phoneNumber, "ID") &&
    !isValidPhoneNumber(reformatted.phoneNumber, "ID")
  )
    reject(
      `Nomor telepon dari guru yang bernama '${reformatted.name}' salah. File: ${file}`
    );

  if (!NameRegex.test(reformatted.name))
    reject(
      `Guru bernama ${reformatted.name} namanya salah, coba di cek kembali apakah nama tersebut sudah benar. File: ${file}`
    );

  return reformatted;
};

export default teacherSorter;
