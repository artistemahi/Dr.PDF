import multer from "multer";
import path from 'path';

// storage config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")  // folder
    },
    filename: (req,file,cb)=>{
         const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        
            const ext = path.extname(file.originalname);
        
            cb(null, uniqueName + ext);
    }
});
// instance
export const upload = multer({storage});