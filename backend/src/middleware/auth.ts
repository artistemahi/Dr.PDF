import jwt from 'jsonwebtoken'
import {UserModel} from "../models/userSchema"
import dotenv from "dotenv";
dotenv.config();

export const UserAuth = async (req: any, res: any, next: Function) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }
    const decodedObj:any =  jwt.verify(token, process.env.SECRET_KEY as string);
    const {id} = decodedObj;
    const user =await UserModel.findById(id);
    if(!user){
        return res.json({
            success: false,
            message:"User not found !"
        })
    }
    req.user = user;
    next();
  } catch (err: any) {
    res.status(400).send("ERROR:" + err.message);
  }
};

