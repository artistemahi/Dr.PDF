import express from "express";
import { UserAuth } from "../middleware/auth";
import { ValidateProfileEdit } from "../utils/validationFn";
import Validator from "validator";
import bcrypt from "bcrypt";
const profileRouter = express.Router();

//  profile/view
profileRouter.get("/profile/view", UserAuth, async (req: any, res: any) => {
  try {
    const { user } = req;
    const safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    };
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: safeUser,
    });
    // console.log(req.user);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//  profile/edit
profileRouter.patch("/profile/edit", UserAuth, async (req: any, res: any) => {
  try {
    const isAllowedEdit = ValidateProfileEdit(req.body);
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    if (isAllowedEdit) {
      Object.keys(req.body).forEach((field) => {
        loggedInUser[field] = req.body[field];
      });
    }
    await loggedInUser.save();

    const safeUser = {
      _id: loggedInUser._id,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      email: loggedInUser.email,
      avatar: loggedInUser.avatar,
    };
    res.json({
      success: true,
      message: `profile updated successfully for user : ${loggedInUser.firstName}`,
      data: safeUser,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

//  profile/password
profileRouter.patch(
  "/profile/password-change",
  UserAuth,
  async (req: any, res: any) => {
    try {
      const loggedInUser = req.user;
      const { oldPasswordInputByUser, newPasswordInputByUser } = req.body;
      const isMatch = await loggedInUser.ValidatePassword(
        oldPasswordInputByUser,
      );
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message:
            "old Password is not correct! please enter the correct old Password.",
        });
      }
      if (!Validator.isStrongPassword(newPasswordInputByUser)) {
        return res.status(400).json({
          success: false,
          message: "Password is not strong enough",
        });
      }

      if (oldPasswordInputByUser === newPasswordInputByUser) {
        return res.status(401).json({
          success: false,
          message: "New password must be different !",
        });
      }
      const hashedNewPassword = await bcrypt.hash(newPasswordInputByUser, 10);
      loggedInUser.password = hashedNewPassword;
      await loggedInUser.save();
      res.json({
        success: true,
        message: "successfully updated the password !",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
);

//  profile/delete

export default profileRouter;
