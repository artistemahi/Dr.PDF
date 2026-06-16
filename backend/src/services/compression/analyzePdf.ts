import fs from "fs";
import { PDFParse } from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import {getImageCount} from "./getImageCount";
import {getFontCount} from "./getFontCount";
export interface PdfAnalysis {
  pages: number;
  textLength: number;
  avgTextPerPages: number;
  fileSizeMb: number;
  metaDataSize: number;
  imageCount:number,
  fontCount:number,
  title: string | undefined;
  author: string | undefined;
  producer: string | undefined;
  creator: string | undefined;
}
export const analyzePdf = async (path: string): Promise<PdfAnalysis>  => {
  // filesize
  const fileSizeMb = fs.statSync(path).size / 1024 / 1024;
  //Pdf parse
  const buffer = fs.readFileSync(path);
  const uint8Array = new Uint8Array(buffer);
  const parser = new PDFParse(uint8Array);

  try {
    const pdfInfo = await parser.getInfo({
      parsePageInfo: true,
    });

    const pdfText = await parser.getText();
    // pdf-lib
    const pdfDoc = await PDFDocument.load(buffer);
    const metaData = {
      title: pdfDoc.getTitle(),
      author: pdfDoc.getAuthor(),
      producer: pdfDoc.getProducer(),
      creator: pdfDoc.getCreator(),
    };
    const metaDataSize = JSON.stringify(metaData).length;
    const pages = pdfInfo.total;
    const textLength = pdfText.text.length;
    const imageCount = await getImageCount(path);
    const fontCount = await getFontCount(path);
    return {
      pages,
      textLength,
      avgTextPerPages: textLength / pages,
      fileSizeMb,
      imageCount,
      fontCount,
      metaDataSize,
      title: metaData.title ?? undefined,
      author:metaData.author ?? undefined,
      producer:metaData.producer ?? undefined,
      creator:metaData.creator ?? undefined,

    };
  } finally {
    await parser.destroy();
  }
}; 
