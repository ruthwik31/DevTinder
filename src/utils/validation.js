const validator = require("validator");
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
module.exports = {
  validateSignUpData,
};
