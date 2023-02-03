const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  IDcampus: {
    type: Schema.Types.ObjectId,
    ref: "Campus",
  
  },
  picture: {
    type: String,
   
  },
  username: {
    type: String,
    
  },
  lastname: {
    type: String,
  
  },
  email: {
    type: String,
 
  },
  phonenumber: {
    type: String,
   
  },
  userprofile: {
    type: String,
    
  },
  IDrole: {
    type: Schema.Types.ObjectId,
    ref: "Role",
  
  },
  account: {
    type: String,
    
  },
  password: {
    type: String,
   
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", userSchema);
