const router = require("express").Router();
const {
  getUsers,
  createUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

// /api/users
router.route("/").get(getUsers).post(createUser);
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
