import archiver from "archiver";

export const sendZip = (
  res: any,
  files: any[],
  fileName = "files.zip"
) => {
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${fileName}`
  );

  const archive = archiver("zip");

  archive.pipe(res);

  files.forEach((file) => {
    archive.append((file.buffer), {
      name: file.name,
    });
  });

  archive.finalize();
};