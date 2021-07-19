const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  ITIDcampus: {
    type: Schema.Types.ObjectId,
    ref: "Campus",
    required: [true, "The IDcampus is required"],
  },
  ITpicture: {
    type: String,
    required: [true, "The picture is required"],
  },
  ITusername: {
    type: String,
    required: [true, "The user name is required"],
  },
  ITlastname: {
    type: String,
    require: [true, "The lastname user is required"],
  },
  ITemail: {
    type: String,
    required: [true, "The email is required"],
  },
  ITphonenumber: {
    type: String,
    required: [true, "The phonenumber is required"],
  },
  ITuserprofile: {
    type: String,
    required: [true, "The user profile is required"],
  },
  ITIDrole: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "The IDrole is required"],
  },
  ITaccount: {
    type: String,
    required: [true, "The account is required"],
  },
  ITpassword: {
    type: String,
    required: [true, "The password is required"],
  },
  ITstatus: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("IT", userSchema);
