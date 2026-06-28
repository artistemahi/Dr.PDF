import express,{ Request, Response } from "express";
import { upload } from "../config/multer";
import { OptionalAuth } from "../middleware/auth";
import {pdfToWord} from "./../services/conversion/PdfToWord"
import fs from "fs"
export  const conversionRouter = express.Router();

// convert/pdf-to-word
conversionRouter.post(
  "/convert/pdf-to-word",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = ""
    let outputFilePath =""
    try{
      const file = req.file as Express.Multer.File
      if(!file){
        throw new Error("No file uploaded");
      }
      if(file.mimetype!=="application/pdf"){
        throw new Error("Only pdf are allowed");
      }
      uploadedFilePath =file.path;
      outputFilePath= `uploads/temp/converted-${Date.now()}.docx`
      // convert
      const result = await pdfToWord(uploadedFilePath,outputFilePath)
      res.download(result,(err)=>{
        if(outputFilePath && fs.existsSync(outputFilePath)){
          fs.unlinkSync(outputFilePath)
        }
      })
    }catch(err:any){
     return res.status(400).json({
        success:false,
        message:err.message
      })
    }finally{
        if(uploadedFilePath && fs.existsSync(uploadedFilePath)){
          fs.unlinkSync(uploadedFilePath)
        }
    }
  },
);
// convert/pdf-to-word
conversionRouter.post(
  "/convert/pdf-to-excel",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = ""
    try{
      const file = req.file as Express.Multer.File
      if(!file){
        throw new Error("No file uploaded");
      }
      if(file.mimetype!=="application/pdf"){
        throw new Error("Only pdf are allowed");
      }
      uploadedFilePath =file.path;
      // convert 
    }catch{

    }finally{

    }
  },
);
// convert/pdf-to-word
conversionRouter.post(
  "/convert/pdf-to-ppt",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = ""
    try{
      const file = req.file as Express.Multer.File
      if(!file){
        throw new Error("No file uploaded");
      }
      if(file.mimetype!=="application/pdf"){
        throw new Error("Only pdf are allowed");
      }
      uploadedFilePath =file.path;
      // convert 
    }catch{

    }finally{

    }
  },
);
// convert/pdf-to-word
conversionRouter.post(
  "/convert/pdf-to-image",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = ""
    try{
      const file = req.file as Express.Multer.File
      if(!file){
        throw new Error("No file uploaded");
      }
      if(file.mimetype!=="application/pdf"){
        throw new Error("Only pdf are allowed");
      }
      uploadedFilePath =file.path;
      // convert 
    }catch{

    }finally{

    }
  },
);
// convert/pdf-to-word
conversionRouter.post(
  "/convert/word-to-pdf",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    let uploadedFilePath = ""
    try{
      const file = req.file as Express.Multer.File
      if(!file){
        throw new Error("No file uploaded");
      }
      if(file.mimetype!=="application/pdf"){
        throw new Error("Only pdf are allowed");
      }
      uploadedFilePath =file.path;
      // convert 
    }catch{

    }finally{

    }
  },
);

