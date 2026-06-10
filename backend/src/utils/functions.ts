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
      if(s<e){
        throw new Error(`invalid page range ${page}`);
      }
      else if(isNaN(s)||isNaN(e)){  // parseint alphabet ko  NaN me bna deta h 
        throw new Error(`invalid page range ${page}`)
      }
      for (let i = s; i <= e; i++) {
        if(!pageNumberArrayOfNumbers.includes(i)){
          pageNumberArrayOfNumbers.push(i);
        }
      }
    }
    else {
      if(isNaN(parseInt(page, 10))) {
        throw new Error(`invalid page number ${page}`);
      }
      if(!pageNumberArrayOfNumbers.includes(parseInt(page,10))){
      pageNumberArrayOfNumbers.push(parseInt(page,10));
    }}
  }
  return pageNumberArrayOfNumbers;
};
