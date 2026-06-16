export type PdfType =
  | "SCANNED_DOCUMENT"
  | "MAGAZINE"
  | "BOOK"
  | "RESEARCH_PAPER"
  | "MIXED";

export const classifyPdf = (
  analysis: {
    pages: number;
    textLength: number;
    avgTextPerPages: number;
    fileSizeMb: number;
    imageCount: number;
    fontCount: number;
  }
): PdfType => {

  const score = {
    SCANNED_DOCUMENT: 0,
    MAGAZINE: 0,
    BOOK: 0,
    RESEARCH_PAPER: 0,
    MIXED: 0,
  };

  const imagesPerPage =
    analysis.imageCount /
    analysis.pages;

  // ---------- MAGAZINE ----------

  if (imagesPerPage > 3)
    score.MAGAZINE += 50;

  if (analysis.imageCount > 100)
    score.MAGAZINE += 30;

  if (
    analysis.avgTextPerPages > 500 &&
    analysis.avgTextPerPages < 4000
  )
    score.MAGAZINE += 20;

  // ---------- RESEARCH ----------

  if (
    analysis.avgTextPerPages > 2500
  )
    score.RESEARCH_PAPER += 20;

  if (
    analysis.fontCount > 10
  )
    score.RESEARCH_PAPER += 10;

  if (
    analysis.imageCount < 50
  )
    score.RESEARCH_PAPER += 40;

  // ---------- BOOK ----------

  if (
    analysis.avgTextPerPages > 2000
  )
    score.BOOK += 30;

  if (
    imagesPerPage < 1
  )
    score.BOOK += 30;

  // ---------- SCANNED ----------

  if (
    analysis.avgTextPerPages < 100
  )
    score.SCANNED_DOCUMENT += 50;

  if (
    analysis.fileSizeMb /
      analysis.pages >
    0.2
  )
    score.SCANNED_DOCUMENT += 20;

  const winner =
    Object.entries(score)
      .sort(
        (a, b) =>
          b[1] - a[1]
      )[0][0];

  return winner as PdfType;
};