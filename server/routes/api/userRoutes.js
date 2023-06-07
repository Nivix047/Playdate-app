const router = require("express").Router();
const {
  getUsers,
  createUser,
  addFriend,
  removeFriend,
  sendFriendRequest,
  acceptFriendRequest,
  loginUser,
  getUserFriends,
  isLoggedIn,
} = require("../../controllers/userController");

// Import our custom middleware
const { authMiddleware } = require("../../utils/auth");

// GET and POST at /api/users
router.route("/").get(getUsers).post(createUser);

// Login user
router.route("/login").post(loginUser);

// Get all friends for a user
router
  .route("/:userId/friends")
  .get(authMiddleware, isLoggedIn, getUserFriends);

// add a friend & remove a friend
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

// send a friend request & accept a friend request
router
  .route("/:userId/friendRequests/:friendId")
  .post(sendFriendRequest)
  .put(acceptFriendRequest);

module.exports = router;
