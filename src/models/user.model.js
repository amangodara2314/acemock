const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  interviewCount: { type: Number, default: 0 },
  lastInterviewDate: { type: Date, default: null },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
