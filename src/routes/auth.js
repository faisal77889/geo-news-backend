const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateSignUp = require("../utils/validateSignUp");
const User = require("../models/user");
const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {
    try {
      const user = req.body;
      const userInfo = validateSignUp(user,true);
      const { firstName, lastName, emailId, password, role, pressId } = userInfo;
  
      const passwordHash = await bcrypt.hash(password, 10);
  
      const userObj = {
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        role,
        pressId: role === "reporter" ? pressId : undefined,
      };
  
      const newUser = new User(userObj);
      const data = await newUser.save();
  
      res.status(201).json({
        message: "User registered successfully",
        data,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  authRouter.post("/login", async(req,res) =>{
    try {
        const user = req.body;
        const userInfo = validateSignUp(user,false);
        const {emailId,password,role,pressId} = userInfo;
        const userInDB = await User.findOne({emailId : emailId});
        if(!userInDB){
            throw new Error("User does not exist in the database");
        }
        if(userInDB.role !== role){
            throw new Error("The role does not match with this user");
        }
        if(role === "reporter"){
            if(pressId !== userInDB.pressId){
                throw new Error("You are providing the wrong press Id");
            }
        }
        const isPasswordValid = await bcrypt.compare(password,userInDB.password);
        if(!isPasswordValid){
            throw new Error("The password does not match ");
        }
        const token = jwt.sign({_id : userInDB._id},"Geonews@123");
        res.cookie("token",token);
        res.status(200).send(userInDB);
        
    } catch (error) {
        res.status(400).json({error : error.message});
    }
  })

  authRouter.post("/logout",(req,res) =>{
    res.cookie("token",null,{
        expires : new Date(Date.now())
    });
    res.send("Logged Out succesfully");
  })
  
  module.exports = authRouter;