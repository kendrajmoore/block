const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

//user model
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema);
