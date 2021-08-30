import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userListSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  precense_time: {
    type: Date,
    default: Date.now,
  },
});

const Absen = new mongoose.Schema({
  absen_id: {
    type: String,
    default: uuidv4,
  },
  assignator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userList: [userListSchema],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Absen", Absen);
