const { Message, User } = require("../models");

module.exports = {
  // Create a new message
  createMessage: async (req, res) => {
    const { recipient, body } = req.body;
    const sender = req.user._id;
    try {
      const message = await Message.create({ sender, recipient, body });
      res.json(message);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get all messages for a user
  getUserMessages: async (req, res) => {
    const userId = req.user._id;
    try {
      const messages = await Message.find({
        $or: [{ sender: userId }, { recipient: userId }],
      });
      res.json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get conversation between two users
  getConversation: async (req, res) => {
    const userId = req.user._id;
    const otherUserId = req.params.otherUserId;
    try {
      const messages = await Message.find({
        $or: [
          { sender: userId, recipient: otherUserId },
          { sender: otherUserId, recipient: userId },
        ],
      });
      res.json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
