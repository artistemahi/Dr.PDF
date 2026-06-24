import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);
export const decryptPdf = async (
  inputPath: string,
  outputPath: string,
  password: string,
) => {
  const command =
    `qpdf --password="${password}" --decrypt -- "${inputPath}" "${outputPath}"`;
  await execAsync(command);
  return outputPath;
};