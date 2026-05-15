import express from "express";
import connectDB from "./config/database"
const app = express();


connectDB()
.then(()=>{
    console.log("connected to database")
    app.listen(3000,()=>{
    console.log("server started at port 3000...");
})
})
.catch((err)=>{console.log("error in connecting to Database ", err)})
