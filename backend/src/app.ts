import express from "express";
import connectDB from "./config/database"
import authRouter from "./routes/authRouter"
import profileRouter from "./routes/profileRouter"
import fileRouter from "./routes/fileRouter"
import cookieParser from "cookie-parser";
import {pdfRouter} from "./routes/pdfRouter"

const app = express();
app.use(cookieParser());
app.use(express.json());


// routes 
app.use("/",authRouter);
app.use("/user",profileRouter);
app.use("/",fileRouter);
app.use("/",pdfRouter);

connectDB()
.then(()=>{
    console.log("connected to database")
    app.listen(3000,()=>{
    console.log("server started at port 3000...");
})
})
.catch((err)=>{console.log("error in connecting to Database ", err)})
