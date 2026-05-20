import express from "express";
const pdfRouter = express.Router();
import {OptionalAuth} from "../middleware/auth";

// pdf/merge
pdfRouter.post("/pdf/merge", OptionalAuth,async (req, res)=>{

});

// pdf/split
pdfRouter.post("/pdf/split", OptionalAuth,async (req, res)=>{

});

// pdf/extract-pages
pdfRouter.post("/pdf/extract-pages", OptionalAuth,async (req, res)=>{

});

// pdf/delete-pages
pdfRouter.post("/pdf/delete-pages", OptionalAuth,async (req, res)=>{

});

// pdf/reorder-pages
pdfRouter.post("/pdf/reorder-pages", OptionalAuth,async (req, res)=>{

});