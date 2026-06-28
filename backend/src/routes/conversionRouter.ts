import express,{ Request, Response } from "express";
import { upload } from "../config/multer";
import { OptionalAuth } from "../middleware/auth";

 const conversionRouter = express.Router();

// convert/pdf-to-word
conversionRouter.post(
  "/convert/pdf-to-word",
  OptionalAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try{

    }catch{

    }finally{

    }
  },
);
export default conversionRouter;
