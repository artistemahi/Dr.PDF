import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbString = process.env.MONGO_STRING || "";
const connectDB = async ()=>{
  await  mongoose.connect(dbString);
    
}
export default connectDB;