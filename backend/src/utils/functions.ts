export const parseRanges = (ranges: string) => {
  return ranges.split(",").map((part) => {
    const [start, end] = part.split("-");
    return [Number(start), Number(end)];
  });
};