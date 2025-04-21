const express = require("express");
const bcrypt = require("bcrypt");
const validateSignUp = require("../utils/validateSignUp");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
      const user = req.body;
      const userInfo = validateSignUp(user);
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
        
        
    } catch (error) {
        res.status(400).json({error : error.message});
    }
  })
  
  module.exports = authRouter;