import fs from "fs";
import { compressPdfWithDPI } from "./Compress";
import { getFileSizeMb } from "../../utils/functions";
export const compressPdfToTarget = async (
  inputPath: string,
  outputPath: string,
  targetSize: number,
) => {
  let low = 30;
  let high = 300;
  let bestFile = "";
  let bestDiff = Infinity;
  for (let i = 0; i < 9; i++) {
    const dpi = Math.floor((low + high) / 2);
    const tempPath = `uploads/temp/test-${dpi}.pdf`;
    await compressPdfWithDPI(inputPath, tempPath, dpi);
    const sizeMb = getFileSizeMb(tempPath);
    const diff = Math.abs(sizeMb - targetSize);
    if (diff <= targetSize * 0.05) {
      console.log("Target size reached within tolerance");
      break;
    }
    if (diff < bestDiff) {
      bestDiff = diff;
      if (bestFile && fs.existsSync(bestFile)) {
        fs.unlinkSync(bestFile);
      }
      bestFile = tempPath;
    } else {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
    if (sizeMb > targetSize) {
      high = dpi - 1;
    } else {
      low = dpi + 1;
    }
  }
  if (!bestFile || !fs.existsSync(bestFile)) {
    throw new Error("Unable to compress PDF to target size");
  }
  fs.copyFileSync(bestFile, outputPath);
  if (bestFile && fs.existsSync(bestFile)) {
    fs.unlinkSync(bestFile);
  }
  return outputPath;
};
