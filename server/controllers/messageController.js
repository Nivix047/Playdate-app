const { Message, User } = require("../models");

module.exports = {
  // Create a new message
  createMessage: async (req, res) => {
    const { sender, recipient, body } = req.body;
    try {
      const message = await Message.create({ sender, recipient, body });
      res.json(message);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get all messages for a user
  getUserMessages: async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [{ sender: req.params.userId }, { recipient: req.params.userId }],
      });
      res.json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get conversation between two users
  getConversation: async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.params.userId, recipient: req.params.otherUserId },
          { sender: req.params.otherUserId, recipient: req.params.userId },
        ],
      });
      res.json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
