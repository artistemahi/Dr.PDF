import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ogiginalName: String,
  fileName: String,
  filePath: String,
  fileType: String,
  size: Number,
},{timestamps:true});

export const fileModel = mongoose.model("file", fileSchema);
