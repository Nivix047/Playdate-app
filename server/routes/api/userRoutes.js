const router = require("express").Router();
const {
  getUsers,
  createUser,
  addFriend,
  removeFriend,
  sendFriendRequest,
  acceptFriendRequest,
} = require("../../controllers/userController");

// GET and POST at /api/users
router.route("/").get(getUsers).post(createUser);

// add a friend & remove a friend
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

// send a friend request & accept a friend request
router
  .route("/:userId/friendRequests/:friendId")
  .post(sendFriendRequest)
  .put(acceptFriendRequest);

module.exports = router;
