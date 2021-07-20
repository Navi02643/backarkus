const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  ITname: {
    type: String,
    required: [true, "The user name is required"],
  },
  ITemail: {
    type: String,
    required: [true, "The email is required"],
  },
  ITstatus: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("IT", userSchema);
