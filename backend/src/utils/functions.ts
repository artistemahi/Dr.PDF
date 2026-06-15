import { ValidationFnForConvertingPageNumberToZeroBasedIndex } from "./validationFn";
import fs from "fs";
export const parseRanges = (ranges: string) => {
  return ranges.split(",").map((part) => {
    const [start, end] = part.split("-");
    return [Number(start), Number(end)];
  });
};
export const parsePageFromPages = (pages: string) => {
  const pageNumberArrayOfNumbers: number[] = [];
  const pageNumberArrayOfString: string[] = pages.split(",");
  for (const page of pageNumberArrayOfString) {
    if (page.includes("-")) {
      const [start, end] = page.split("-");
      const s = parseInt(start, 10);
      const e = parseInt(end, 10);
      if (s > e) {
        throw new Error(`invalid page range ${page}`);
      } else if (isNaN(s) || isNaN(e)) {
        // parseint alphabet ko  NaN me bna deta h
        throw new Error(`invalid page range ${page}`);
      }
      for (let i = s; i <= e; i++) {
        if (!pageNumberArrayOfNumbers.includes(i)) {
          pageNumberArrayOfNumbers.push(i);
        }
      }
    } else {
      if (isNaN(parseInt(page, 10))) {
        throw new Error(`invalid page number ${page}`);
      }
      if (!pageNumberArrayOfNumbers.includes(parseInt(page, 10))) {
        pageNumberArrayOfNumbers.push(parseInt(page, 10));
      }
    }
  }
  return pageNumberArrayOfNumbers;
};
export const RemainingPages = (Pdf: any, pagesToDelete: number[]) => {
  const totalPage = Pdf.getPageCount();
  ValidationFnForConvertingPageNumberToZeroBasedIndex(Pdf, pagesToDelete);
  const PagesToDeleteZeroIndex = pagesToDelete.map(
    (PageNum: number) => PageNum - 1,
  );
  const remaingPages: number[] = [];
  for (let i = 0; i < totalPage; i++) {
    if (!PagesToDeleteZeroIndex.includes(i)) {
      remaingPages.push(i);
    }
  }
  if (remaingPages.length === 0) {
    throw new Error("Cannot delete all pages");
  }
  return remaingPages;
};

export const getZeroBasedIndexOfPages= ((order:number[])=>{
  const zeroBasedIndexOfPages = order.map((pageNum:number)=>{return pageNum-1})
  return zeroBasedIndexOfPages;
});
export const parseOrder = (order: string) => {
  const orderArrayOfNumbers: number[] = [];

  const orderArrayOfString = order.split(",");

  for (const page of orderArrayOfString) {

    if (page.includes("-")) {

      const [start, end] = page.split("-");

      const s = parseInt(start, 10);
      const e = parseInt(end, 10);

      if (isNaN(s) || isNaN(e) || s > e) {
        throw new Error(`invalid page range ${page}`);
      }

      for (let i = s; i <= e; i++) {
        orderArrayOfNumbers.push(i);
      }

    } else {

      const pageNum = parseInt(page, 10);

      if (isNaN(pageNum)) {
        throw new Error(`invalid page number ${page}`);
      }

      orderArrayOfNumbers.push(pageNum);
    }
  }

  return orderArrayOfNumbers;
};
export const getFileSizeMb = (path:string)=>{
  const fileSize = fs.statSync(path).size;
  return fileSize / 1024 / 1024;
};