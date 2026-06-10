import fs from "fs";
import { PDFDocument } from "pdf-lib";
import express, { Request, Response } from "express";
import { OptionalAuth } from "../middleware/auth";
import { upload } from "../config/multer";
import mergePdf from "../utils/mergepdf";
import { FileModel } from "../models/fileSchema";
import { parseRanges } from "../utils/functions";
import { splitPdf } from "../utils/splitPdf";
import { sendZip } from "../utils/zipFiles";
import { parsePageFromPages } from "../utils/functions";
import { ValidationFnForConvertingPageNumberToZeroBasedIndex } from "../utils/validationFn";

interface AuthenticatedRequest extends Request {
  user?: {
    _id?: string;
    [key: string]: any;
  };
}

export const pdfRouter = express.Router();

// pdf/merge
pdfRouter.post(
  "/pdf/merge",
  OptionalAuth,
  upload.array("files", 10),
  async (req: any, res: any) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (files.some((file) => file.mimetype !== "application/pdf")) {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded !",
        });
      }
      const filePaths: any = files.map((file: any) => {
        return file.path;
      });
      const mergedPdf: any = await mergePdf(filePaths);

      let savedFile = null;
      if (req.user) {
        const fileName = `merged-${Date.now()}.pdf`;
        const filePath = `uploads/user-files${fileName}`;

        fs.writeFileSync(filePath, mergedPdf);

        savedFile = await FileModel.create({
          userId: req.user._id,
          originalName: "merged.pdf",
          fileName,
          filePath,
          fileType: "application/pdf",
          size: mergedPdf.length,
        });
      }

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
      if (savedFile) {
        res.setHeader("X-File-Id", savedFile._id.toString()); // giving fileId for frontend
      }
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
pdfRouter.post(
  "/pdf/split",
  OptionalAuth,
  upload.single("file"),
  async (req: any, res: any) => {
    let uploadedFilePath = "";

    try {
      const file = req.file as Express.Multer.File;
      const { ranges } = req.body;

      // File validation
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      uploadedFilePath = file.path;

      // Only PDF allowed
      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }

      // Range validation
      if (!ranges) {
        return res.status(400).json({
          success: false,
          message: "Ranges are required",
        });
      }

      // Parse ranges
      const parsedRanges = parseRanges(ranges);

      // Read uploaded PDF
      const pdfBytes = fs.readFileSync(file.path);

      // Load PDF
      const pdf = await PDFDocument.load(pdfBytes);

      const totalPages = pdf.getPageCount();

      // Validate page ranges
      parsedRanges.forEach(([start, end]: number[]) => {
        if (start < 1 || end > totalPages || start > end) {
          throw new Error(`Invalid range: ${start}-${end}`);
        }
      });

      // Split PDF
      const splitBuffers = await splitPdf(pdf, parsedRanges);

      // Save files for logged-in users
      if (req.user?._id) {
        for (const fileObj of splitBuffers) {
          const fileName = `${Date.now()}-${fileObj.name}`;
          const filePath = `uploads/user-files${fileName}`;

          fs.writeFileSync(filePath, Buffer.from(fileObj.buffer));

          await FileModel.create({
            userId: req.user._id,
            originalName: fileObj.name,
            fileName,
            filePath,
            fileType: "application/pdf",
            size: Buffer.from(fileObj.buffer).length,
          });
        }
      }

      // Send zip to user
      return sendZip(res, splitBuffers, "split-files.zip");
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    } finally {
      // Remove uploaded input file
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);

// pdf/extract-pages
pdfRouter.post(
  "/pdf/extract-pages",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = "";
    try {
      // file upload and page numbers in body
      const file = req.file as Express.Multer.File;
      // validation of file
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }
      uploadedFilePath = file.path;
      const { pages } = req.body; // geting as a string from body, need to convert it into array of numbers
      // validation of pages
      if (!pages) {
        return res.status(400).json({
          success: false,
          message: "No pages specified",
        });
      }
      const PageNumber = parsePageFromPages(pages);
      // loading the file
      const PdfBytes = fs.readFileSync(file.path); // raw data
      const Pdf = await PDFDocument.load(PdfBytes); // object data
      const extractedPages = await PDFDocument.create(); // new pdf document to add extracted pages
      // validatin of page numbers
      ValidationFnForConvertingPageNumberToZeroBasedIndex(Pdf, PageNumber);
      const PagesToCopy = await extractedPages.copyPages(
        Pdf,
        PageNumber.map((num: number) => num - 1), // convert to zero-based indexs
      );
      PagesToCopy.forEach((page) => extractedPages.addPage(page));
      const extractedPdfBytes = await extractedPages.save();

      // Save file for logged-in users
      const user = (req as any).user;
      if (user && user._id) {
        const fileName = `extracted-${Date.now()}.pdf`;
        const filePath = `uploads/user-files/${fileName}`;
        fs.writeFileSync(filePath, Buffer.from(extractedPdfBytes));

        await FileModel.create({
          userId: user._id,
          originalName: "extracted-pages.pdf",
          fileName,
          filePath,
          fileType: "application/pdf",
          size: Buffer.from(extractedPdfBytes).length,
        });
      }
      res.setHeader("Content-Type", "application/pdf");

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=extracted-pages.pdf",
      );

      return res.send(Buffer.from(extractedPdfBytes));
    } catch (err: any) {
     return res.status(400).json({
        success: false,
        message: err.message,
      });
    } finally {
      // delete uploaded temp file

      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);

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
