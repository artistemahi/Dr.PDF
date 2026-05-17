import express from "express";
import connectDB from "./config/database"
import authRouter from "./routes/authRouter"
import profileRouter from "./routes/profileRouter"
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());


// routes 
app.use("/",authRouter);
app.use("/user",profileRouter);

connectDB()
.then(()=>{
    console.log("connected to database")
    app.listen(3000,()=>{
    console.log("server started at port 3000...");
})
})
.catch((err)=>{console.log("error in connecting to Database ", err)})
