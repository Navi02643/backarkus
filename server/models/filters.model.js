const mongoose = require("mongoose");
const { Schema } = mongoose;

const filterSchema = new Schema({
  mark: {
    type: Boolean,
    default: true,
  },
  model: {
    type: Boolean,
    default: true,
  },
  equipmentdescription: {
    type: Boolean,
    default: true,
  },
  serialnumber: {
    type: Boolean,
    default: true,
  },
  enviroment: {
    type: Boolean,
    default: true,
  },
  state: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  typeequipment: {
    type: Schema.Types.ObjectId,
    ref: "Typeequipment",
  },
});

module.exports = mongoose.model("Filters", filterSchema);
