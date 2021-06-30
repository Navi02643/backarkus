const mongoose = require("mongoose");
const { Schema } = mongoose;

const typeequipmentSchema = new Schema({
  tename: {
    type: String,
    required: [true, "The type equipment name is required"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  imagen: {
    type: String,
    default: "",
  }
});

module.exports = mongoose.model("Typeequipment", typeequipmentSchema);
