const router = require("express").Router();
const {
  createMessage,
  getSingleMessage,
} = require("../../controllers/messageController");

// /api/messages
router.route("/").get(getSingleMessage).post(createMessage);

// /api/messages/:messageId
router.route("/:messageId").get(getSingleMessage);

module.exports = router;
