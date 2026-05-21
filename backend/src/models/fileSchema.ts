import mongoose from "mongoose";
interface Data {
  userId:mongoose.Types.ObjectId,
  originalName:String,
  fileName:String,
  fileType:String,
  filePath:String,
  size:Number
}

const fileSchema = new mongoose.Schema<Data>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  originalName: String,
  fileName: String,
  filePath: String,
  fileType: String,
  size: Number,
},{timestamps:true});

export const FileModel = mongoose.model("file", fileSchema);
