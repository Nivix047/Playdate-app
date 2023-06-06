const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

module.exports = mongoose.model("Group", GroupSchema);
