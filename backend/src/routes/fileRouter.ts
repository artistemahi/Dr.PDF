import express from "express";
import { UserAuth } from "../middleware/auth";
import { FileModel } from "../models/fileSchema";
import { UserModel } from "../models/userSchema";
import fs from "fs";
const fileRouter = express.Router();
import { upload } from "../config/multer";

// file upload
fileRouter.post(
  "/file/upload",
  UserAuth,
  upload.array("files", 10),
  async (req: any, res: any) => {
    try {
      const files = req.files;
      console.log(files);
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded !",
        });
      }

      const user = req.user;
      const savedFiles = await Promise.all(
        files.map((file: any) =>
          FileModel.create({
            userId: user._id,
            originalName: file.originalname,
            fileName: file.filename,
            filePath: file.path,
            fileType: file.mimetype,
            size: file.size,
          }),
        ),
      );
      res.json({
        success: true,
        data: savedFiles,
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  },
);

//  GET    /file/:fileId
fileRouter.get("/file/:fileId", UserAuth, async (req: any, res: any) => {
  try {
    const { fileId } = req.params;
    const user = req.user;
    if (!fileId || fileId.length == 0) {
      return res.status(401).json({
        success: false,
        message: "file id is required ",
      });
    }
    const fileData = await FileModel.findById(fileId);
    if (!fileData) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }
    if (fileData.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    res.json({
      success: true,
      data: fileData,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

//  DELETE /file/:fileId
fileRouter.delete("/file/:fileId", UserAuth, async (req: any, res: any) => {
  try {
    const { fileId } = req.params;
    if (!fileId || fileId.length == 0) {
      return res.status(400).json({
        success: false,
        message: "File Id is required !",
      });
    }
    const user = req.user;
    const fileData: any = await FileModel.findById(fileId);

    if (!fileData) {
      return res.status(404).json({
        success: false,
        message: "file not found !",
      });
    }
    if (fileData.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access!",
      });
    }
    if (fs.existsSync(fileData.filePath)) {
      fs.unlinkSync(fileData.filePath);
    }
    await fileData.deleteOne();
    res.json({
      success: true,
      message: "file successfully deleted !",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET    /file/user/all
fileRouter.get("/file/user/all", UserAuth, async (req, res) => {
  try {
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

export default fileRouter;
