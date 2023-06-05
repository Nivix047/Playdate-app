const { Message } = require("../models");

module.exports = {
  // Create a new message
  createMessage(req, res) {
    Message.create(req.body)
      .then((messageData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { messages: messageData._id } },
          { new: true }
        );
      })
      .then((messageData) => {
        res.json(messageData);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  // Get a single message by either their id or their username
  getSingleMessage(req, res) {
    Message.findOne({ _id: req.params.messageId })
      .select("-__v")
      .then((messageData) => {
        if (!messageData) {
          return res.status(404).json({ message: "No thought with this ID!" });
        }
        res.json(messageData);
      })
      .catch((error) => res.status(500).json(error));
  },
};
