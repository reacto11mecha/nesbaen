import mongoose from "mongoose";

const Absen = new mongoose.Schema({
  absen_id: {
    type: String,
  },
  asignnator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userList: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      precense_time: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  created_at: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Absen", Absen);
