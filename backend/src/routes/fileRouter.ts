import express from "express"
import {UserAuth} from "../middleware/auth";


const fileRouter = express.Router();

// file upload
fileRouter.post("/file/upload",UserAuth, async (req,res)=>{
    
}) 



