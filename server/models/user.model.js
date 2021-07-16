const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  IDcampus: {
    type: Schema.Types.ObjectId,
    ref: "Campus",
    required: [true, "The IDcampus is required"],
  },
  picture: {
    type: String,
    required: [true, "The picture is required"],
  },
  username: {
    type: String,
    required: [true, "The user name is required"],
  },
  lastname: {
    type: String,
    require: [true, "The lastname user is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
  },
  phonenumber: {
    type: String,
    required: [true, "The phonenumber is required"],
  },
  userprofile: {
    type: String,
    required: [true, "The user profile is required"],
  },
  IDrole: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "The IDrole is required"],
  },
  account: {
    type: String,
    required: [true, "The account is required"],
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", userSchema);
