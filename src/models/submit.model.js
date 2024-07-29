const mongoose = require("mongoose");
const User = require("./user.model");
const { default: Interview } = require("./interview.model");

const SubmitSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.ObjectId, ref: "User" },
  interview_id: { type: mongoose.Schema.ObjectId, ref: "Interview" },
  createdAt: { type: Date, default: new Date() },
  details: [
    {
      question: { type: String },
      userAnswer: { type: String },
      correctAnswer: { type: String },
      rating: { type: String },
      improvement: { type: String },
    },
  ],
});

const Submit = mongoose.models.Submit || mongoose.model("Submit", SubmitSchema);

module.exports = Submit;
