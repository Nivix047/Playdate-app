const router = require("express").Router();
const {
  getUsers,
  createUser,
  // addFriend,
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
router
  .route("/:userId/friends/:friendId")
  //  can be used to add a friend without authentication like a follow each other feature
  // .post(authMiddleware, isLoggedIn, addFriend)
  .delete(authMiddleware, isLoggedIn, removeFriend);

// send a friend request & accept a friend request
router
  .route("/:userId/friendRequests/:friendId")
  .post(authMiddleware, isLoggedIn, sendFriendRequest)
  .put(authMiddleware, isLoggedIn, acceptFriendRequest);

module.exports = router;
