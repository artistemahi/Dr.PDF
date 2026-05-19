import express from "express";
import { UserAuth } from "../middleware/auth";
const fileRouter = express.Router();

// file upload
fileRouter.post("/file/upload", UserAuth, async (req, res) => {});

//  GET    /file/:fileId
fileRouter.get("/file/:fileId", UserAuth, async (req, res) => {});

//  DELETE /file/:fileId
fileRouter.delete("/file/:fileId", UserAuth, async (req, res) => {});

 // GET    /file/user/all
fileRouter.get("/file/user/all", UserAuth, async (req, res) => {});
