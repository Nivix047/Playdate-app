const router = require("express").Router();
const {
  createMessage,
  getUserMessages,
  getConversation,
} = require("../../controllers/messageController");

router.route("/").post(createMessage);
router.route("/:userId").get(getUserMessages);
router.route("/:userId/conversation/:otherUserId").get(getConversation);

module.exports = router;
