const mongoose = require("mongoose");
const { Schema } = mongoose;

const assignedSchema = new Schema({
  IDuser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The IDuser is required"],
  },
  serialnumber: {
    type: Schema.Types.ObjectId,
    ref: "Equipment",
    required: [true, "The serial number is required"],
  },
  assignedby: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The IDuser is required"],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Assigned", assignedSchema);
