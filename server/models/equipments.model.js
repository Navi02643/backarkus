const mongoose = require("mongoose");
const { Schema } = mongoose;

const equipmentSchema = new Schema({
  IDuser: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  IDcampus: {
    type: Schema.Types.ObjectId,
    ref: "Campus",
  },
  IDtypeequipment: {
    type: Schema.Types.ObjectId,
    ref: "Typeequipment",
  },
  mark: {
    type: String,
  },
  model: {
    type: String,
  },
  equipmentdescription: {
    type: String
  },
  serialnumber: {
    type: String,
  },
  enviroment: {
    type: String,
  },
  state: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Equipment", equipmentSchema);
