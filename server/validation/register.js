const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPass = !isEmpty(data.confirmPass) ? data.confirmPass : "";

  // Name checks
  if (Validator.isEmpty(data.username)) {
    errors.infoError = "Username field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.infoError = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.infoError = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.infoError = "Password field is required";
  }
  if (Validator.isEmpty(data.confirmPass)) {
    errors.infoError = "Confirm password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
    errors.infoError = "Password must be at least 6 characters";
  }

  if (!Validator.equals(data.password, data.confirmPass)) {
    errors.infoError = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
