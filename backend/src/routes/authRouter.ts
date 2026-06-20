import express from "express";
import {ValidationFnForUserInfo} from "../utils/validationFn";
import { UserModel } from "../models/userSchema";
import bcrypt from "bcrypt";

interface UserInput {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}
const authRouter = express.Router();

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password }: UserInput = req.body;

    // validation
    const result = ValidationFnForUserInfo(firstName, lastName, email, password);
    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // check existing user
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // token
    const token = savedUser.getJwtToken();

    // cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    // response
    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    // current user get
    const { email, password } = req.body;
    const isUserExist = await UserModel.findOne({ email: email });
    if (!isUserExist) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    // password match
    const isPasswordMatch = await isUserExist.ValidatePassword(password);
    //     console.log("Entered password:", password);
    // console.log("Stored hash:", isUserExist.password);
    if (isPasswordMatch) {
      const token = isUserExist.getJwtToken();
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.json({
        success: true,
        message: "Login successful",
        data: {
          _id: isUserExist._id,
          firstName: isUserExist.firstName,
          email: isUserExist.email,
        },
      });
    } else {
      throw new Error("Invalid password");
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// logout api
authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });
    res.json({message:"Logout Successful !"})
  } catch (err: any) {
    res.status(400).send("Error:" + err.message);
  }
});
export default authRouter;
