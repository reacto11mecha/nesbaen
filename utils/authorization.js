import permittedOrNot from "./permittedOrNot.js";

const isStudent = permittedOrNot("siswa", "pengurus");
const isManager = permittedOrNot("pengurus", "guru", "admin");
const isAdmin = permittedOrNot("admin");

export { isStudent, isManager, isAdmin };
