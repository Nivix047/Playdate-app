const router = require("express").Router();
const {
  createMessage,
  getUserMessages,
  getConversation,
} = require("../../controllers/messageController");

// Import our custom middleware
// const isLoggedIn = require("../../utils/isLoggedIn");

// Import our custom middleware
const { authMiddleware } = require("../../utils/auth");

router.route("/").post(authMiddleware, createMessage);
router.route("/:userId").get(authMiddleware, getUserMessages);
router
  .route("/:userId/conversation/:otherUserId")
  .get(authMiddleware, getConversation);

module.exports = router;
