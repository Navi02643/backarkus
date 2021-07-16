const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleSchema = new Schema({
  rolename: {
    type: String,
    required: [true, "The role name is required"],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
