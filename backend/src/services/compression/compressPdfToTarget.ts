import fs from "fs";
import { compressPdf } from "./Compress";
export const compressPdfToTarget = async (
  inputPath: string,
  outputPath: string,
  targetSize: number,
) => {
    const levels =["low","medium","high"] as const;
    let currentInputPath = inputPath;
    for(const level of levels){
        await compressPdf(inputPath,outputPath,level);
        const sizeMb = fs.statSync(currentInputPath).size;
        if(sizeMb<=targetSize){
            return outputPath;
        }
        currentInputPath=outputPath;
    }
    return outputPath;
};
