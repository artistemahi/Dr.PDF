import { PdfType } from "./classifyPdf";

export interface CompressionCandidate {
  dpi: number;
  jpegQuality: number;
  priority: number;
}

export const generateCandidates = (
  pdfType: PdfType,
): CompressionCandidate[] => {

  switch (pdfType) {

    case "MAGAZINE":
      return [
        {
          dpi: 60,
          jpegQuality: 65,
          priority: 1,
        },
        {
          dpi: 80,
          jpegQuality: 75,
          priority: 2,
        },
        {
          dpi: 100,
          jpegQuality: 85,
          priority: 3,
        },
      ];

    case "SCANNED_DOCUMENT":
      return [
        {
          dpi: 40,
          jpegQuality: 50,
          priority: 1,
        },
        {
          dpi: 60,
          jpegQuality: 60,
          priority: 2,
        },
        {
          dpi: 80,
          jpegQuality: 70,
          priority: 3,
        },
      ];

    case "RESEARCH_PAPER":
      return [
        {
          dpi: 150,
          jpegQuality: 85,
          priority: 1,
        },
        {
          dpi: 200,
          jpegQuality: 90,
          priority: 2,
        },
        {
          dpi: 250,
          jpegQuality: 95,
          priority: 3,
        },
      ];

    case "BOOK":
      return [
        {
          dpi: 180,
          jpegQuality: 90,
          priority: 1,
        },
        {
          dpi: 220,
          jpegQuality: 95,
          priority: 2,
        },
        {
          dpi: 300,
          jpegQuality: 100,
          priority: 3,
        },
      ];

    default:
      return [
        {
          dpi: 100,
          jpegQuality: 75,
          priority: 1,
        },
        {
          dpi: 150,
          jpegQuality: 85,
          priority: 2,
        },
        {
          dpi: 200,
          jpegQuality: 95,
          priority: 3,
        },
      ];
  }
};