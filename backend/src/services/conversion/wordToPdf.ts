import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
const execAsync = promisify(exec);
export const wordToPdf = async (inputFilePath: string, outputDir: string) => {
  const command = `soffice --headless --convert-to pdf "${inputFilePath}" --outdir "${outputDir}"`;
  console.log(command);
  await execAsync(command);
  const fileName = path.basename(inputFilePath, path.extname(inputFilePath));
  const outputFilePath = path.join(outputDir, `${fileName}.pdf`);
  if (!fs.existsSync(outputFilePath)) {
    throw new Error("PDF conversion failed");
    }

    return outputFilePath;
};
