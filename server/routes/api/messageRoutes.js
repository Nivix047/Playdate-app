const express = require("express");
const router = express.Router();
const Message = require("../../models/Message");
const { authMiddleware } = require("../../utils/auth");

router.post("/", authMiddleware, async (req, res) => {
  const { recipient, body } = req.body;

  const message = new Message({
    sender: req.user._id,
    recipient,
    body,
  });

  await message.save();
  res.json({ message: "Message sent!" });
});

router.get("/", authMiddleware, async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  })
    .populate("sender")
    .populate("recipient")
    .sort({ timestamp: -1 });

  res.json(messages);
});

module.exports = router;
