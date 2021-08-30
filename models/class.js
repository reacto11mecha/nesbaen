import mongoose from "mongoose";

const classNames = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Class = new mongoose.Schema({
  gradeName: { type: String, required: true },
  classNames: [classNames],
});

export default mongoose.model("Class", Class);
