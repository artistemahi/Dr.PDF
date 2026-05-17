import express from "express";
import { UserAuth } from "../middleware/auth";
const profileRouter = express.Router();

//  profile/view
profileRouter.get("/profile/view", UserAuth, async (req: any, res: any) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
    console.log(req.user);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


export default profileRouter;
