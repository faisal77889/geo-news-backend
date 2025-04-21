const validator = require("validator");

const validateSignUp = (userInfo) => {
  const { firstName, lastName, emailId, password, role, pressId } = userInfo;

  if (!firstName || firstName.length < 3) {
    throw new Error("FirstName is not valid");
  }

  if (!lastName || lastName.length < 3) {
    throw new Error("LastName is not valid");
  }

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email id is not valid");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("The password is not strong, set a strong password");
  }

  if (!role || (role !== "user" && role !== "reporter")) {
    throw new Error("Role must be either 'user' or 'reporter'");
  }

  if (role === "reporter" && !pressId) {
    throw new Error("Reporter must have a press ID");
  }

  return {
    firstName,
    lastName,
    emailId,
    password,
    role,
    ...(pressId && { pressId })
  };
};

module.exports = validateSignUp;
