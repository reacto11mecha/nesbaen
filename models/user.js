import mongoose from "mongoose";
import { isValidPhoneNumber } from "libphonenumber-js";

import { NameRegex } from "../utils/regex.js";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Masukkan nama lengkap!"],
    validate: {
      validator: (v) => NameRegex.test(v),
      message: (props) => `${props.value} bukanlah nama yang valid!`,
    },
  },
  roles: [
    {
      type: String,
      enum: ["admin", "guru", "pengurus", "siswa"],
      default: "siswa",
    },
  ],
  nomorTelepon: {
    type: String,
    validate: {
      validator: (v) => isValidPhoneNumber(v, "ID"),
      message: (props) => `${props.value} bukanlah nama yang valid!`,
    },
  },
  className: Name,
});
