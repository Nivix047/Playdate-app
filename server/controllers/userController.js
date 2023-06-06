const { User } = require("../models");

module.exports = {
  // GET all users
  async getUsers(req, res) {
    try {
      const userData = await User.find().select("-__v");
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new user
  async createUser({ body }, res) {
    try {
      const userData = await User.create(body);
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a friend to a user's friend list
  async addFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      ).populate("friends");
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      ).populate("friends");
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Send a friend request
  async sendFriendRequest(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friendRequests: req.params.friendId } },
        { new: true }
      );
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Accept a friend request
  async acceptFriendRequest(req, res) {
    try {
      const userData = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: { friendRequests: req.params.friendId },
          $addToSet: { friends: req.params.friendId },
        },
        { new: true }
      );
      const friendData = await User.findByIdAndUpdate(
        req.params.friendId,
        {
          $addToSet: { friends: req.params.userId },
        },
        { new: true }
      );
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
