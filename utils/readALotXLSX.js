import XLSX from "xlsx";

import studentSorter from "../common/studentSorter.js";
import teacherSorter from "../common/teacherSorter.js";

import fs from "node:fs";
import path from "node:path";

const sensitiveDIR = new URL("../sensitive", import.meta.url);
const files = fs
  .readdirSync(sensitiveDIR)
  .filter((file) => file.endsWith(".xlsx"));

const readXLSX = (file) =>
  new Promise((resolve, reject) => {
    (async () => {
      const filePath = path.join(sensitiveDIR.pathname, file);
      const sheetName = file.replace(".xlsx", "");

      const workbook = XLSX.readFile(filePath);
      if (!workbook.SheetNames.includes(sheetName))
        reject(
          `Format tidak sesuai. Nama sheet harus sama dengan nama file ! File: ${file}`
        );

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      const isTeacher = sheetName === "GURU";
      const sSorter = !isTeacher
        ? await studentSorter(sheetName, reject, file)
        : null;

      const cleanData = data.map(
        isTeacher ? teacherSorter(reject, file) : sSorter
      );

      const sorted = cleanData.sort((a, b) => a.name.localeCompare(b.name));

      resolve(sorted);
    })();
  });

export default async function readXLSXes() {
  try {
    let users = [];

    for (const file of files) {
      const data = await readXLSX(file);

      users = [...users, data];
    }

    return users.reduce((curr, acc) => curr.concat(acc));
  } catch (e) {
    console.log(e);
    process.exit();
  }
}
