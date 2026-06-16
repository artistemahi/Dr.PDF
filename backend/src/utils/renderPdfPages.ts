import fs from "fs";
import path from "path";

import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

export const renderPdfPages = async (
  pdfPath: string,
  outputPrefix: string,
  pages = 3,
) => {
  const outputDir = path.dirname(outputPrefix);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {
      recursive: true,
    });
  }

  const command = `
pdftoppm
-f 1
-l ${pages}
-png
"${pdfPath}"
"${outputPrefix}"
`.replace(/\n/g, " ");

  console.log("Rendering PDF:", pdfPath);

  console.log(command);

  const result = await execAsync(command);

  console.log(result.stdout);

  console.log(result.stderr);
};
