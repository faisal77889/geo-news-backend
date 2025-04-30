const express = require("express");
const reporterAuth = require("../middleware/reporterAuth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const reporterProfileValidation = require("../utils/reporterProfileValidation");
const reporterProfileRouter = express.Router();


reporterProfileRouter.get("/reporter/me", reporterAuth, async (req, res) => {
    try {
      const reporterId = req.reporter._id;
  
      const reporter = await User.findById(reporterId)
        .select("-password -__v -tokens") // will come back after some time 
        .lean();
  
      if (!reporter) {
        return res.status(404).json({
          message: "Reporter not found in the database",
        });
      }
  
      res.status(200).json({
        message: "Reporter profile fetched successfully",
        data: reporter,
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  });

// NOte - will do refactoring of the whole code so that it works for both reporter and user
reporterProfileRouter.patch("/reporter/me", reporterAuth, async (req, res) => {
    try {
      const reporterId = req.reporter._id;
  
      const reporter = await User.findById(reporterId);
      if (!reporter) {
        return res.status(404).json({
          message: "Reporter not found in the database",
        });
      }
  
      const updationData = req.body;
  
      // Validate the incoming update data
      const afterValidation = reporterProfileValidation(updationData);
  
      // Update the reporter document with validated data
      Object.keys(afterValidation).forEach((key) => {
        reporter[key] = afterValidation[key];
      });
  
      // Save the updated reporter
      const updatedReporter = await reporter.save();
  
      res.status(200).json({
        message: "Reporter profile updated successfully",
        data: updatedReporter,
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong with updation of reporter profile",
        error: error.message,
      });
    }
});



reporterProfileRouter.patch("/reporter/password", reporterAuth, async (req, res) => {
    try {
      const reporterId = req.reporter._id;
  
      // Fetch the reporter from the database
      const reporter = await User.findById(reporterId);
      if (!reporter) {
        return res.status(404).json({
          message: "Reporter not found in the database",
        });
      }
  
      // Get oldPassword and newPassword from the request body
      const { oldPassword, newPassword } = req.body;
  
      // Check if the old password matches
      const passwordHashInDb = reporter.password;
      const doPasswordMatch = await bcrypt.compare(oldPassword, passwordHashInDb);
      if (!doPasswordMatch) {
        throw new Error("The old password does not match. You cannot change the password.");
      }
  
      // Hash the new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
  
      // Update the password in the database
      reporter.password = newPasswordHash; // Corrected this line
      const updatedReporter = await reporter.save();
  
      // Respond with a success message
      res.status(200).json({
        message: "Reporter password updated successfully",
        data: updatedReporter,
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        message: "Something went wrong while updating the reporter's profile",
        error: error.message,
      });
    }
  });

  module.exports = reporterProfileRouter;
  

  