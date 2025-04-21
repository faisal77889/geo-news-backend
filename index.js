const express = require("express");
const app = express();
const connectDB = require("./src/config/database")


const authRouter = require("./src/routes/auth");


app.use(express.json());


app.use("/",authRouter);


connectDB()
.then(()=>{
    console.log("connected to the database succesfully");
    app.listen('5000',(req,res)=>{
        console.log("listening on port 5000...")
    })
})
.catch((err)=>{
    console.log("something error is there " + err.message);
})