import { exec } from "child_process"; // exec is used to run external program like notepad , calc , etc and improted from child_process module built in node

import { promisify } from "util"; // exec is calleback based but we want to use async/await so we make it promise using promisify
const execAsync = promisify(exec); // now we can use it as async/await

export const compressPdf = async (
  inputPath: string,
  outputPath: string,
  level: "low" | "medium" | "high",
) => {
  let pdfSetting = "/ebook";
  switch (level) {
    case "low":
      pdfSetting = "/prepress";
      break;

    case "medium":
      pdfSetting = "/ebook";
      break;

    case "high":
      pdfSetting = "/screen";
      break;
    default:
      throw new Error("Invalid compression level");
  }
  const GS_COMMAND = process.platform === "win32" ? "gswin64c" : "gs";
  const command = `${GS_COMMAND} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${pdfSetting} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

  try {
    await execAsync(command);
  } catch (err: any) {
    console.error(err);

    throw new Error(err.stderr || err.message);
  }
  return outputPath;
};

export const compressPdfWithDPI = async (inputPath:string,outputPath:string,dpi:number)=>{
  const GS_COMMAND = process.platform==="win32" ? "gswin64c" :"gs";
   const command = `
${GS_COMMAND}
-sDEVICE=pdfwrite
-dCompatibilityLevel=1.4
-dNOPAUSE
-dQUIET
-dBATCH
-dColorImageDownsampleType=/Bicubic
-dGrayImageDownsampleType=/Bicubic
-dMonoImageDownsampleType=/Subsample
-dColorImageResolution=${dpi}
-dGrayImageResolution=${dpi}
-dMonoImageResolution=${dpi}
-sOutputFile="${outputPath}"
"${inputPath}"
`.replace(/\n/g, " ");

  await execAsync(command);

  return outputPath;
};
