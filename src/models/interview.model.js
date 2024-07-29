import { Schema, model, models } from "mongoose";

const interviewSchema = new Schema({
  title: { type: String, required: true },
  techStack: { type: String, required: true },
  experience: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  questions: [
    {
      question: { type: String, required: true },
    },
  ],
});

const Interview = models.Interview || model("Interview", interviewSchema);

export default Interview;
