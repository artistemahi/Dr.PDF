import express, { Request, Response } from "express";
import { upload } from "../config/multer";
import { OptionalAuth } from "../middleware/auth";
import { pdfToWord } from "./../services/conversion/pdfToWord";
import { wordToPdf } from "./../services/conversion/wordToPdf";
import { excelToPdf } from "./../services/conversion/excelToPdf";
import fs from "fs";
export const conversionRouter = express.Router();

// convert/pdf-to-word
conversionRouter.post(
  "/convert/pdf-to-word",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = "";
    let outputFilePath = "";
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        throw new Error("No file uploaded");
      }
      if (file.mimetype !== "application/pdf") {
        throw new Error("Only pdf are allowed");
      }
      uploadedFilePath = file.path;
      outputFilePath = `uploads/temp/converted-${Date.now()}.docx`;
      // convert
      const result = await pdfToWord(uploadedFilePath, outputFilePath);
      res.download(result, (err) => {
        if (outputFilePath && fs.existsSync(outputFilePath)) {
          fs.unlinkSync(outputFilePath);
        }
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } finally {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);
// convert/word-to-pdf
conversionRouter.post(
  "/convert/word-to-pdf",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = "";
    let outputFilePath = "";
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        throw new Error("No file uploaded");
      }
      const allowedMimeTypes: string[] = [
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.oasis.opendocument.text", // .odt
        "application/rtf", // .rtf
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error(
          "Only word files (.doc, .docx, .odt, .rtf) are allowed",
        );
      }

      uploadedFilePath = file.path;
      outputFilePath = `uploads/temp`;
      // convert
      const result = await wordToPdf(uploadedFilePath, outputFilePath);
      res.download(result, (err) => {
        if (result && fs.existsSync(result)) {
          fs.unlinkSync(result);
        }
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } finally {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);
// convert/excel-to-pdf
conversionRouter.post(
  "/convert/excel-to-pdf",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = "";
    let outputFilePath = "";
    try {
      const file = req.file as Express.Multer.File;
      const allowedMimeTypes = [
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.oasis.opendocument.spreadsheet", // .ods
      ];
      if (!file) {
        throw new Error("No file uploaded");
      }

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error("Only excel (.xls, .xlsx, .ods) file are allowed");
      }
      uploadedFilePath = file.path;
      outputFilePath = `uploads/temp`;
      // convert call
      const result = await excelToPdf(uploadedFilePath, outputFilePath);
      res.download(outputFilePath, (err) => {
        if (result && fs.existsSync(result)) {
          fs.unlinkSync(result);
        }
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } finally {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);

// convert/pdf-to-word
conversionRouter.post(
  "/convert/word-to-pdf",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = "";
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        throw new Error("No file uploaded");
      }
      if (file.mimetype !== "application/pdf") {
        throw new Error("Only pdf are allowed");
      }
      uploadedFilePath = file.path;
      // convert
    } catch {
    } finally {
    }
  },
);
