import Validator from "validator";
import { PDFDocument } from "pdf-lib";
export const ValidationFnForUserInfo = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): { isValid: boolean; message?: string } => {
  // field should not be empty
  if (
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    return { isValid: false, message: "Field should not be empty" };
  }

  // password checking
  if (!Validator.isStrongPassword(password)) {
    return {
      isValid: false,
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
    };
  }
  // email checking
  if (!Validator.isEmail(email)) {
    return { isValid: false, message: "Email is not valid !" };
  }

  return { isValid: true };
};

export const ValidateProfileEdit = (body: any) => {
  const allowedField = ["firstName", "lastName", "avatar", "country"];
  const field = Object.keys(body || {});
  if (field.length === 0) {
    throw new Error("No fields provided for update !");
  }

  field.forEach((f) => {
    if (!allowedField.includes(f)) {
      throw new Error("Field is not allowed to update !");
    }
  });
  return true;
};

export const ValidationFnForConvertingPageNumberToZeroBasedIndex = (
  Pdf: PDFDocument,
  PageNumber: number[],
) => {
  const totalPages = Pdf.getPageCount();
  PageNumber.forEach((PageNum: number) => {
    if (isNaN(PageNum) || PageNum < 1 || PageNum > totalPages) {
      throw new Error(`invalid Pages ${PageNum}`);
    }
  });
};
export const ValidationFnForOrder = (Pdf: PDFDocument, order: number[]) => {
  const totalPages = Pdf.getPageCount();
  const uniquePages = new Set(order);
  if (order.length !== totalPages) {
    throw new Error(
      `Order must include all pages exactly once. Total pages: ${totalPages}`,
    );
  }
  if (uniquePages.size !== order.length) {
    throw new Error("Duplicate page numbers are not allowed in order");
  }
  order.forEach((PageNum: number) => {
    if (isNaN(PageNum) || PageNum < 1 || PageNum > totalPages) {
      throw new Error(`invalid page number ${PageNum} in order`);
    }
  });
};
export const ValidationFnForSize = (size: number) => {
  if (isNaN(size) || size <= 0) {
    throw new Error("Target size is not valid");
  }
};
export const ValidationFnForPasswordForPdfProtect = (password: string) => {
  const cleanedPassword = password.trim();
  if (!cleanedPassword || cleanedPassword.length === 0) {
    throw new Error("Password should not be empty!");
  }
  if (cleanedPassword.length > 20) {
    throw new Error("Password cannot exceed 20 characters");
  }
  if (cleanedPassword.length < 3) {
    throw new Error("Password should contains more than 2 character!");
  }
};
export const ValidateFnForWatermark = (watermarkText:string)=>{
  const trimWaterMarkText = watermarkText.trim()
    if(!watermarkText && watermarkText.length===0){
      throw new Error("invalid watermark")
    }
    return trimWaterMarkText;
}