import XLSX from "xlsx";
import parsePhoneNumber from "libphonenumber-js";

import fs from "node:fs";
import path from "node:path";

const { isPossiblePhoneNumber, isValidPhoneNumber } = parsePhoneNumber;

const sensitiveDIR = new URL("../sensitive", import.meta.url);
const files = fs
  .readdirSync(sensitiveDIR)
  .filter((file) => file.endsWith(".xlsx"));

const readXLSX = (file) =>
  new Promise((resolve, reject) => {
    const filePath = path.join(sensitiveDIR.pathname, file);
    const sheetName = file.replace(".xlsx", "");

    const workbook = XLSX.readFile(filePath);
    if (!workbook.SheetNames.includes(sheetName))
      reject(
        `Format tidak sesuai. Nama sheet harus sama dengan nama file ! File: ${file}`
      );

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });

    const cleanData = data.map((d) => {
      const keys = Object.keys(d);

      if (
        !keys.includes("NAMA SISWA") |
        !keys.includes("NO TELEPON") |
        !keys.includes("ROLE")
      )
        reject(
          `Format tidak sesuai. Judul data harus menggunakan "NAMA SISWA", "NO TELEPON", "ROLE". File: ${file}`
        );

      const reformatted = {
        name: d["NAMA SISWA"].trim(),
        phoneNumber: d["NO TELEPON"].trim().replace(".", "+"),
        role: d.ROLE.trim(),
      };

      if (
        !isPossiblePhoneNumber(reformatted.phoneNumber, "ID") &&
        !isValidPhoneNumber(reformatted.phoneNumber, "ID")
      )
        reject(
          `Nomor telepon dari siswa yang bernama '${reformatted.name}' salah. File: ${file}`
        );

      return reformatted;
    });

    const sorted = cleanData.sort((a, b) => a.name.localeCompare(b.name));

    resolve({ data: sorted, className: sheetName });
  });

export default async function readXLSXes() {
  try {
    let penampung = [];

    for (const file of files) {
      const data = await readXLSX(file);

      penampung = [...penampung, data];
    }

    return penampung;
  } catch (e) {
    console.log(e);
    process.exit();
  }
}