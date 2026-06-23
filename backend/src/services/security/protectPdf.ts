import { exec } from "child_process";
import { promisify } from "util";
import fs from 'fs'
const execAsync = promisify(exec);

export const protectPdf = async (
  inputPath: string,
  outputPath: string,
  password: string,
) => {
  const command =
    `qpdf --encrypt "${password}" "${password}" 256 -- "${inputPath}" "${outputPath}"`.replace(
      /\n/g,
      " ",
    );

  console.log(command);

  await execAsync(command);
  
  return outputPath;
};
