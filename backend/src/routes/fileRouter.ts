import express from "express";
import { UserAuth } from "../middleware/auth";
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, uniqueName + ext);
  },
});

const fileRouter = express.Router();

// file upload
fileRouter.post("/file/upload", UserAuth, async (req, res) => {});
