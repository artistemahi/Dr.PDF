import {exec} from "child_process";
import {promisify} from "util";
const execAsync = promisify(exec);
export const getImageCount=async (pdfPath:string)=>{
    const command = `pdfimages -list "${pdfPath}"`;
    const {stdout} = await execAsync(command);
    const line = stdout.split("\n").slice(2).filter(line=>line.trim());
    return line.length;
}