import fs from "fs";
import { PDFDocument } from "pdf-lib";
import express, { Request, Response } from "express";
import { OptionalAuth } from "../middleware/auth";
import { upload } from "../config/multer";
import mergePdf from "../utils/mergepdf";
import { FileModel } from "../models/fileSchema";
import {
  parseOrder,
  getZeroBasedIndexOfPages,
  parseRanges,
} from "../utils/functions";
import { splitPdf } from "../utils/splitPdf";
import { sendZip } from "../utils/zipFiles";
import { parsePageFromPages } from "../utils/functions";
import { RemainingPages } from "../utils/functions";
import {
  ValidationFnForConvertingPageNumberToZeroBasedIndex,
  ValidationFnForOrder,
  ValidationFnForSize,
} from "../utils/validationFn";
import { compressPdf } from "../services/compression/Compress";
import { compressPdfToTarget } from "../services/compression/compressPdfToTarget";
import { analyzePdf } from "../services/compression/analyzePdf";
import { classifyPdf } from "../services/compression/classifyPdf";
export const pdfRouter = express.Router();

//-------File Operations--------

// pdf/merge
pdfRouter.post(
  "/pdf/merge",
  OptionalAuth,
  upload.array("files", 10),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded !",
        });
      }
      if (files.some((file) => file.mimetype !== "application/pdf")) {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }
      const filePaths: any = files.map((file: any) => {
        return file.path;
      });
      const mergedPdf: any = await mergePdf(filePaths);

      let savedFile = null;
      const user = (req as any).user;
      if (user) {
        const fileName = `merged-${Date.now()}.pdf`;
        const filePath = `uploads/user-files/${fileName}`;

        fs.writeFileSync(filePath, mergedPdf);

        savedFile = await FileModel.create({
          userId: user._id,
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
  async (req: Request, res: Response) => {
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
      const user = (req as any).user;
      if (user) {
        for (const fileObj of splitBuffers) {
          const fileName = `${Date.now()}-${fileObj.name}`;
          const filePath = `uploads/user-files/${fileName}`;

          fs.writeFileSync(filePath, Buffer.from(fileObj.buffer));

          await FileModel.create({
            userId: user._id,
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
          message: "No pages specified to extract",
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
pdfRouter.post(
  "/pdf/delete-pages",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = "";
    try {
      // load the file
      const file = req.file as Express.Multer.File;
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
      const { pages } = req.body;
      if (!pages) {
        return res.status(400).json({
          success: false,
          message: "No pages specified to delete",
        });
      }
      // parsing pages
      const PageNumberToDelete = parsePageFromPages(pages);

      // loading the file
      const PdfBytes = fs.readFileSync(uploadedFilePath);
      const Pdf = await PDFDocument.load(PdfBytes);

      // removing the pages index from total pages
      const remainingPages = RemainingPages(Pdf, PageNumberToDelete);

      // creating the new pdf file
      const deletedPDF = await PDFDocument.create();

      // copy the remaining pages to new pdf file
      const PagesToCopy = await deletedPDF.copyPages(Pdf, remainingPages);
      // adding pages to new pdf file
      PagesToCopy.forEach((page) => deletedPDF.addPage(page));
      // saving the pdf file as bytes
      const deletedPdfBytes = await deletedPDF.save();

      // Save file for logged-in users
      const user = (req as any).user;
      if (user && user._id) {
        const fileName = `deleted-${Date.now()}.pdf`;
        const filePath = `uploads/user-files/${fileName}`;
        fs.writeFileSync(filePath, Buffer.from(deletedPdfBytes));

        await FileModel.create({
          userId: user._id,
          originalName: "deleted-pages.pdf",
          fileName,
          filePath,
          fileType: "application/pdf",
          size: Buffer.from(deletedPdfBytes).length,
        });
      }
      res.setHeader("Content-Type", "application/pdf"); // telling browser that we are sending pdf file

      // telling browser to download the file instead of displaying it on the browser and giving it a name "deleted-pages.pdf"
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=deleted-pages.pdf",
      );
      // else returning for non logged in users
      return res.send(Buffer.from(deletedPdfBytes));
    } catch (err: any) {
      res.status(400).json({
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

// pdf/reorder-pages
pdfRouter.post(
  "/pdf/reorder-pages",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = "";
    try {
      // file load
      const file = req.file as Express.Multer.File;
      if (!file) {
        throw new Error("No file uploaded");
      }
      if (file.mimetype !== "application/pdf") {
        throw new Error("Only PDF files are allowed");
      }
      uploadedFilePath = file.path;
      const { order } = req.body;
      if (!order) {
        throw new Error("No page order specified");
      }
      // loading the file
      const PdfBytes = fs.readFileSync(uploadedFilePath);
      const Pdf = await PDFDocument.load(PdfBytes);
      // parsing page order
      const NewPageOrder = parseOrder(order);

      // validation for page order
      ValidationFnForOrder(Pdf, NewPageOrder);
      // converting page order to zero based index
      const zeroBasedIndexOfPages = getZeroBasedIndexOfPages(NewPageOrder);

      // creating new pdf file and copying pages in new order
      const NewPdf = await PDFDocument.create();
      const PagesToCopy = await NewPdf.copyPages(Pdf, zeroBasedIndexOfPages);
      PagesToCopy.forEach((page) => NewPdf.addPage(page));

      const NewPdfBytes = await NewPdf.save();

      // save file for logged-in users
      const user = (req as any).user;
      if (user && user._id) {
        const fileName = `reordered-${Date.now()}.pdf`;
        const filePath = `uploads/user-files/${fileName}`;
        fs.writeFileSync(filePath, Buffer.from(NewPdfBytes));
        await FileModel.create({
          userId: user._id,
          originalName: "reordered-pages.pdf",
          fileName,
          filePath,
          fileType: "application/pdf",
          size: Buffer.from(NewPdfBytes).length,
        });
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "content-disposition",
        "attachment; filename=reordered-pages.pdf",
      );
      res.send(Buffer.from(NewPdfBytes));
    } catch (err: any) {
      return res.status(500).json({
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

//-------Compression & Optimization--------

// pdf/compress-level
pdfRouter.post(
  "/pdf/compress-level",
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
      const { level } = req.body;
      if (!level || !["low", "medium", "high"].includes(level)) {
        return res.status(400).json({
          success: false,
          message: "Level must be low, medium or high",
        });
      }
      const originalSize = fs.statSync(uploadedFilePath).size;
      // output file path
      const outputFilePath = `uploads/temp/compressed-${Date.now()}.pdf`;

      // calling the compressed function
      const result = await compressPdf(uploadedFilePath, outputFilePath, level);
      const compressedSize = fs.statSync(outputFilePath).size;
      const savedPercentage = (
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(2);
      const user = (req as any).user;

      if (user && user._id) {
        const fileName = `compressed-${Date.now()}.pdf`;

        const permanentPath = `uploads/user-files/${fileName}`;

        fs.copyFileSync(outputFilePath, permanentPath);

        await FileModel.create({
          userId: user._id,
          originalName: "compressed.pdf",
          fileName,
          filePath: permanentPath,
          fileType: "application/pdf",
          size: compressedSize,
        });
      }
      res.setHeader(
        "X-Original-Size",
        `${(originalSize / 1024 / 1024).toFixed(2)} MB`,
      );

      res.setHeader(
        "X-Compressed-Size",
        `${(compressedSize / 1024 / 1024).toFixed(2)} MB`,
      );

      res.setHeader("X-Saved-Percentage", `${savedPercentage}%`);

      return res.download(outputFilePath, "compressed.pdf", (err) => {
        if (err) {
          console.error(err);
        }

        if (outputFilePath && fs.existsSync(outputFilePath)) {
          fs.unlinkSync(outputFilePath);
        }
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        Error: err?.message,
      });
    } finally {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);

// pdf/compress-target-size
pdfRouter.post(
  "/pdf/compress-target-size",
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
      const targetSize = Number(req.body.targetSize);
      ValidationFnForSize(targetSize);
      outputFilePath = `uploads/temp/target-${Date.now()}.pdf`;

      await compressPdfToTarget(uploadedFilePath, outputFilePath, targetSize);
      return res.download(outputFilePath, "compressed.pdf", (err) => {
        if (outputFilePath && fs.existsSync(outputFilePath)) {
          fs.unlinkSync(outputFilePath);
        }
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        Error: err?.message,
      });
    } finally {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);

// pdf/compress-smartai
pdfRouter.post(
  "/pdf/compress-smart",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath="";
    try{
      const file = req.file as Express.Multer.File;
      if(!file){
        throw new Error("No file uploaded");
      }
      if(file.mimetype!=="application/pdf"){
        throw new Error("Only pdf allowed");
      }
      uploadedFilePath = file.path;
      const analyzePdfResult = await analyzePdf(uploadedFilePath);
      console.log(analyzePdfResult);
      const classifyPdfResult = await classifyPdf(analyzePdfResult);
      console.log(classifyPdfResult);
      
    }catch(err:any){
      res.status(500).json({
        success:false,
        message:err?.message
      })
    }finally{
      if(uploadedFilePath && fs.existsSync(uploadedFilePath)){
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);
//  pdf/optimize
pdfRouter.post(
  "/pdf/optimize",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = "";
    try {
    } catch (err: any) {
      res.status(500).json({
        success: false,
        Error: err?.message,
      });
    } finally {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }
  },
);
