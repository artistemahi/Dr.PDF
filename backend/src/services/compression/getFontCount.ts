import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const getFontCount = async (
  pdfPath: string,
) => {

  const command =
    `pdffonts "${pdfPath}"`;

  const { stdout } =
    await execAsync(command);

  const fontsNames =
    stdout
      .split("\n")
      .slice(2)
      .filter(
        line => line.trim()
      );
      const uniqueSet = new Set(fontsNames)

  return uniqueSet.size;
};