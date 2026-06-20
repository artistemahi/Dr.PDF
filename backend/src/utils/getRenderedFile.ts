import fs from "fs";
import path from "path";

export const getRenderedFile = (
  prefix: string,
  page: number,
) => {

  const files =
    fs.readdirSync(
      "uploads/render"
    );

  const match =
    files.find(
      file =>
        (
          file ===
          `${prefix}-${page}.png`
        ) ||
        (
          file ===
          `${prefix}-0${page}.png`
        )
    );

  if (!match) {
    throw new Error(
      `Rendered file not found: ${prefix}-${page}`
    );
  }

  return path.join(
    "uploads/render",
    match
  );
};