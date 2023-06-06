const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
    timestamp: { type: Date, default: Date.now },
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
});

module.exports = mongoose.model("Message", MessageSchema);
