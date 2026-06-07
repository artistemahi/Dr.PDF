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
      for (let i = s; i <= e; i++) {
        pageNumberArrayOfNumbers.push(i);
      }
    }
    else {
      pageNumberArrayOfNumbers.push(parseInt(page));
    }
  }
  return pageNumberArrayOfNumbers;
};
