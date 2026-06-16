import fs from "fs";

import { analyzePdf } from "./analyzePdf";

import { classifyPdf } from "./classifyPdf";

import { generateCandidates } from "./generateCandidates";

import { compressPdfWithDPI } from "./Compress";

import { renderPdfPages } from "../../utils/renderPdfPages";

import { mse } from "../../utils/compareImages";

import { scoreCandidate } from "./scoreCandidates";

import { getFileSizeMb } from "../../utils/functions";
export const smartCompressPdf = async (
  inputPath: string,
  outputPath: string,
) => {
  const analysis = await analyzePdf(inputPath);
  const pdfType = classifyPdf(analysis);
  const candidates = generateCandidates(pdfType);
  const originalSizeMB = getFileSizeMb(inputPath);
  let bestScore = -Infinity;

  let bestFile = "";
  for (const candidate of candidates) {
    const candidatePath = `uploads/temp/candidate-${candidate.dpi}.pdf`;
    await compressPdfWithDPI(inputPath, candidatePath, candidate.dpi);
    await renderPdfPages(inputPath, "uploads/render/original");
    await renderPdfPages(candidatePath, `uploads/render/${candidate.dpi}`);
    const mseScore = await mse(
      "uploads/render/original-01.png",
      `uploads/render/${candidate.dpi}-01.png`,
    );
    const finalSizeMB = getFileSizeMb(candidatePath);
    const result = scoreCandidate(
      originalSizeMB,
      finalSizeMB,
      mseScore,
      candidatePath,
    );
    if (result.score > bestScore) {
      bestScore = result.score;

      bestFile = candidatePath;
    }
  }
  if (!bestFile) {
    throw new Error("No valid candidate found");
  }
  fs.copyFileSync(bestFile, outputPath);
  return outputPath;
};
