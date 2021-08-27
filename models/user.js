import mongoose from "mongoose";
import parsePhoneNumber from "libphonenumber-js";

import enum from "../roles.config.js";

import { NameRegex } from "../utils/regex.js";

const { isPossiblePhoneNumber, isValidPhoneNumber } = parsePhoneNumber;

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
      enum,
      default: "siswa",
    },
  ],
  nomorTelepon: {
    type: String,
    validate: {
      validator: (v) =>
        isPossiblePhoneNumber(v, "ID") && isValidPhoneNumber(v, "ID"),
      message: (props) => `${props.value} bukanlah nama yang valid!`,
    },
  },
  className: Name,
});
