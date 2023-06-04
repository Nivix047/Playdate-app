const { Message, User } = require("../models/index");

const messageController = {
  // Create a new message
  createMessage: async (req, res) => {
    try {
      const { sender, recipient, body } = req.body;
      const message = await Message.create({ sender, recipient, body });
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to create message." });
    }
  },

  // Fetch all messages
  getAllMessages: async (req, res) => {
    try {
      const messages = await Message.find()
        .populate("sender")
        .populate("recipient")
        .sort({ timestamp: -1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages." });
    }
  },

  // Get messages by user
  getMessagesByUser: async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [{ sender: req.user._id }, { recipient: req.user._id }],
      })
        .populate("sender")
        .populate("recipient")
        .sort({ timestamp: -1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages." });
    }
  },
};

module.exports = messageController;
