import fs from "fs";
import express from "express";
import { OptionalAuth } from "../middleware/auth";
import { upload } from "../config/multer";
import mergePdf from "../utils/mergepdf";

const pdfRouter = express.Router();

// pdf/merge
pdfRouter.post(
  "/pdf/merge",
  OptionalAuth,
  upload.array("files", 10),
  async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length == 0) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded !",
        });
      }
      const filePaths: any = files.map((file: any) => {
        return file.path;
      });
      const mergedPdf: any = await mergePdf(filePaths);
      filePaths.forEach((path: any) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=merged-${Date.now()}.pdf`,
      );

      res.send(Buffer.from(mergedPdf));
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

// pdf/split
pdfRouter.post("/pdf/split", OptionalAuth, async (req, res) => {
  try {
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// pdf/extract-pages
pdfRouter.post("/pdf/extract-pages", OptionalAuth, async (req, res) => {
  try {
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// pdf/delete-pages
pdfRouter.post("/pdf/delete-pages", OptionalAuth, async (req, res) => {
  try {
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// pdf/reorder-pages
pdfRouter.post("/pdf/reorder-pages", OptionalAuth, async (req, res) => {
  try {
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});
