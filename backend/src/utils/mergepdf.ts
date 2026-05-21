import {PDFDocument} from 'pdf-lib'
import fs from "fs"
const mergePdf = async (filePaths:String)=>{
 const emptypdf =await PDFDocument.create();

 for(const filePath of filePaths){
    // reading th file    
    const PdfByte = fs.readFileSync(filePath);
    // loading the existing pdf 
    const pdf =await PDFDocument.load(PdfByte);
    const pages= await emptypdf.copyPages(
        pdf,
        pdf.getPageIndices()
    );

    pages.forEach((page)=>{
       return  emptypdf.addPage(page);
    });
   }
   const mergedPdfBytes = await emptypdf.save();
   return mergedPdfBytes;
}
export default mergePdf;