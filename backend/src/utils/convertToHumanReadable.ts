import {exec} from "child_process"
import {promisify} from "util"

const execAsync = promisify(exec)
export const convertToHumanReadable=async (uploadedFilePath:string ,outputFilePath:string)=>{
    const command = `qpdf --qdf "${uploadedFilePath}" "${outputFilePath}"`
    console.log(command)
   await execAsync(command);
    return outputFilePath;
}