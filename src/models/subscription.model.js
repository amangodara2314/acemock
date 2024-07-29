const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: Boolean, required: true },
});

subscriptionSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.status = currentDate >= this.startDate && currentDate <= this.endDate;
  next();
});

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
