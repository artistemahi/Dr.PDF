import fs from "fs";
import { PDFDocument, rgb, degrees } from "pdf-lib";
export const addWaterMark = async (
  uploadedFilePath: string,
  outputFilePath: string,
  watermarkText: string,
) => {
  const existingPdfBytes = fs.readFileSync(uploadedFilePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width / 3,
      y: height / 3,

      size: 50,

      opacity: 0.3,

      rotate: degrees(45),

      color: rgb(1, 0, 0),
    })
    const PdfByte = await pdfDoc.save()
    fs.writeFileSync(outputFilePath,PdfByte)
  }
  return outputFilePath;
};
