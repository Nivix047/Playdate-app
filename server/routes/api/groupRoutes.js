const router = require("express").Router();
const {
  createGroup,
  addUserToGroup,
  getGroupMessages,
  createGroupMessage,
  removeUserFromGroup,
  inviteUserToGroup,
  acceptGroupInvite,
} = require("../../controllers/groupController");

const { isLoggedIn } = require("../../controllers/userController");

// Import our custom middleware
const { authMiddleware } = require("../../utils/auth");

// Create a group & add a user to a group
router.route("/").post(authMiddleware, isLoggedIn, createGroup);

// Invite a user to a group & accept a group invitation
router
  .route("/:groupId/invites/:userId")
  .post(authMiddleware, isLoggedIn, inviteUserToGroup)
  .put(authMiddleware, isLoggedIn, acceptGroupInvite);

// Add a user to a group & remove a user from a group
router
  .route("/:groupId/users/:userId")
  .post(addUserToGroup)
  .delete(removeUserFromGroup);

// Get all messages in a group & create a message in a group
router
  .route("/:groupId/messages")
  .get(getGroupMessages)
  .post(createGroupMessage);

module.exports = router;
