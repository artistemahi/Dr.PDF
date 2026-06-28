import fs from "fs"
import {exec} from "child_process"
import {promisify} from "util"

const execAsync = promisify(exec)
export const pdfToWord =async(inputFilePath:string,outputFilePath:string)=>{
    const command =`python src/scripts/pdf-to-word.py "${inputFilePath}" "${outputFilePath}"`
    console.log(command);
    await execAsync(command)
    if(!fs.existsSync(outputFilePath)){
        throw new Error("outputFilePath missing")
    }
    return outputFilePath;
}
