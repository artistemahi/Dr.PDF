import Validator from "validator";
import { PDFDocument } from "pdf-lib";
export const ValidationFn = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): {isValid:boolean,message?:string} => {
  // field should not be empty
  if(!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()){
    return ({isValid:false, message:"Field should not be empty"});
  }
  
  // password checking
  if(!Validator.isStrongPassword(password)){
    return ({isValid:false,message:"Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"});
  }
  // email checking
  if(!Validator.isEmail(email)){
    return ({isValid:false,message:"Email is not valid !"});
  }

  return {isValid:true};
};

export const ValidateProfileEdit = (body:any)=>{
   const allowedField = [
    "firstName",
    "lastName",
    "avatar",
    "country",
   ];
   const field = Object.keys(body || {});
   if(field.length===0){
    throw new Error("No fields provided for update !");
   }

   field.forEach((f)=>{
     if(!allowedField.includes(f)){
      throw new Error("Field is not allowed to update !")
     }
   });
   return true;
};

export const ValidationFnForConvertingPageNumberToZeroBasedIndex = (Pdf:PDFDocument,PageNumber:number[])=>{
    const totalPages = Pdf.getPageCount();
    PageNumber.forEach((PageNum:number)=>{
      if(!PageNum||PageNum<1 || PageNum>totalPages){
        throw new Error(`invalid Pages ${PageNum}`);
      }
    })
};