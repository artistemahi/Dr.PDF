import mongoose from "mongoose";
import Validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
interface Data {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  avatar: string;
  getJwtToken(): string;
  ValidatePassword(password: string): Promise<boolean>;
}
const userSchema = new mongoose.Schema<Data>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 30,
    },
    country: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      validate(value: string) {
        const isValid = Validator.isURL(value);
        const isBase64Image = value.startsWith("data:image/");
        if (!isValid && !isBase64Image) {
          throw new Error("photo url is not valid");
        }
      },
    },
  },
  { timestamps: true },
);

userSchema.methods.getJwtToken = function () {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined!");
  }

  return jwt.sign({ id: this._id }, process.env.SECRET_KEY);
};

userSchema.methods.ValidatePassword = function (UserInputPassword: string) {
  const isMatch = bcrypt.compareSync(UserInputPassword, this.password);
  return isMatch;
};

export const UserModel = mongoose.model("User", userSchema);
