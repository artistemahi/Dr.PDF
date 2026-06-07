import { PDFDocument } from "pdf-lib";

export const splitPdf = async (pdf: any, parsedRanges: number[][]) => {
  const splitBuffers = [];

  for (let i = 0; i < parsedRanges.length; i++) {
    const [start, end] = parsedRanges[i];

    const newPdf = await PDFDocument.create();

    const pages = await newPdf.copyPages(
      pdf,
      Array.from({ length: end - start + 1 }, (_, idx) => start - 1 + idx)
    );

    pages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();

    splitBuffers.push({
      name: `part-${i + 1}.pdf`,
      buffer: Buffer.from(pdfBytes),
    });
  }

  return splitBuffers;
};