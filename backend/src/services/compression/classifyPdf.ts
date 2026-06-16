import { PdfAnalysis } from "./analyzePdf";

export type PdfType =
  | "SCANNED_DOCUMENT"
  | "MAGAZINE"
  | "BOOK"
  | "RESEARCH_PAPER"
  | "MIXED";

export const classifyPdf = (
  analysis: PdfAnalysis,
): PdfType => {

  const {
    pages,
    textLength,
    avgTextPerPages,
    fileSizeMb,
  } = analysis;

  const sizePerPage =
    fileSizeMb / pages;

  const charDensity =
    textLength /
    fileSizeMb;

  // Scanned PDF
  if (
    avgTextPerPages < 100 &&
    sizePerPage > 0.10
  ) {
    return "SCANNED_DOCUMENT";
  }

  // Research Paper
  if (
    avgTextPerPages > 2500 &&
    charDensity > 30000
  ) {
    return "RESEARCH_PAPER";
  }

  // Book
  if (
    avgTextPerPages > 1500 &&
    sizePerPage < 0.05
  ) {
    return "BOOK";
  }

  // Magazine
  if (
    avgTextPerPages > 300 &&
    avgTextPerPages < 2000
  ) {
    return "MAGAZINE";
  }

  return "MIXED";
};