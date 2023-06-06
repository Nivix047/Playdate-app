const router = require("express").Router();
const {
  createGroup,
  addUserToGroup,
  getGroupMessages,
  createGroupMessage,
  removeUserFromGroup,
} = require("../../controllers/groupController");

// Create a group & add a user to a group
router.route("/").post(createGroup);

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
