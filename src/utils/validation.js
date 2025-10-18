const validator = require("validator");
const validateNewPassword = (req) => {
  if (!req.body || !req.body.newPassword) {
    throw new Error("Password is missing");
  }
  const { newPassword } = req.body;
  try {
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("The password is not Strong Enough");
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
};
const validateSignUpData = (req) => {
  const { first_name, last_name, emailId, password, skills } = req.body;
  if (!first_name) {
    throw new Error("First name cannot be empty");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  } else if (skills && skills.length > 10) {
    throw new Error("Skills array cannot exceed 10 items");
  }
};
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "emailId",
    "first_name",
    "photoUrl",
    "last_name",
    "password",
    "age",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateNewPassword,
};
