import parsePhoneNumber from "libphonenumber-js";
import { NameRegex, xlsxSheetSplitter } from "../utils/regex.js";
import whatsRole from "../utils/whatsRole.js";

import Class from "../models/class.js";

const { isPossiblePhoneNumber, isValidPhoneNumber } = parsePhoneNumber;

const studentSorter = async (sheetName, reject, file) => {
  const splittedSheetname = sheetName.split(xlsxSheetSplitter);

  const gradeClass = await Class.findOne({
    gradeName: splittedSheetname[0],
  }).lean();

  if (!gradeClass)
    return reject(
      `Kelas ${sheetName} tidak pernah ada ! File: ${sheetName}.xlsx`
    );

  const className = gradeClass.classNames.find(
    (className) => className.name === splittedSheetname[1]
  );

  if (!className)
    return reject(
      `Tidak ada kelas yang bernama '${splittedSheetname[1]}' di kelas ${gradeClass.gradeName} ! File: ${sheetName}.xlsx`
    );

  return (d) => {
    const keys = Object.keys(d);

    if (
      !keys.includes("NAMA SISWA") |
      !keys.includes("NO TELEPON") |
      !keys.includes("ROLE")
    )
      reject(
        `Format tidak sesuai. Judul data harus menggunakan "NAMA SISWA", "NO TELEPON", "ROLE". File: ${file}`
      );

    const roles = whatsRole(d.ROLE);
    if (roles instanceof Error)
      reject(`${roles} File: ${file}, Nama Siswa: ${d["NAMA SISWA"].trim()}`);

    const reformatted = {
      name: d["NAMA SISWA"]
        .toLowerCase()
        .trim()
        .replace(/\b(\w)/g, (s) => s.toUpperCase()),
      phoneNumber: d["NO TELEPON"].trim().replace(".", "+"),
      roles,
      className: {
        grade: gradeClass._id,
        gradeName: className._id,
      },
    };

    if (
      !isPossiblePhoneNumber(reformatted.phoneNumber, "ID") &&
      !isValidPhoneNumber(reformatted.phoneNumber, "ID")
    )
      reject(
        `Nomor telepon dari siswa yang bernama '${reformatted.name}' salah. File: ${file}`
      );

    if (!NameRegex.test(reformatted.name))
      reject(
        `Siswa bernama ${reformatted.name} namanya salah, coba di cek kembali apakah nama tersebut sudah benar. File: ${file}`
      );

    return reformatted;
  };
};

export default studentSorter;
