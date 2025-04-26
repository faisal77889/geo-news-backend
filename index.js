const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/database")


const authRouter = require("./src/routes/auth");
const reporterRouter = require("./src/routes/reporterRouter");
const userRouter = require("./src/routes/user");


app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",reporterRouter);
app.use("/",userRouter);


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