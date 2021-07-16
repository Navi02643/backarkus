const mongoose = require("mongoose");
const { Schema } = mongoose;

const waitingSchema = new Schema({
  IDuser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The IDuser is required"],
  },
  IDtypeequiment: {
    type: Schema.Types.ObjectId,
    ref: "Typeequipment",
    required: [true, "The IDtypeequipment is required"],
  },
});

module.exports = mongoose.model("Waiting", waitingSchema);
