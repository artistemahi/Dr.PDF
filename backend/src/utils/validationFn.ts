import Validator from "validator";

const ValidationFn = (
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
export default ValidationFn;
