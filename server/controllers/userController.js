const { User } = require("../models");
const jwt = require("../utils/auth").signToken;

// Middleware to check if user is logged in
const isLoggedIn = async (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You need to be logged in to perform this action." });
  }
  next();
};

module.exports = {
  isLoggedIn,
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

  // Login user
  async loginUser(req, res) {
    try {
      const userData = await User.findOne({ email: req.body.email });
      if (!userData) {
        res.status(404).json({ message: "No user with this email address." });
        return;
      }

      const correctPw = await userData.isCorrectPassword(req.body.password);

      if (!correctPw) {
        res.status(400).json({ message: "Incorrect password." });
        return;
      }

      const token = jwt(userData);
      res.json({ token, user: userData });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Get all friends for a user
  async getUserFriends(req, res, next) {
    isLoggedIn(req, res, async () => {
      try {
        const userData = await User.findById(req.user._id)
          .populate("friends")
          .select("-__v");
        res.json(userData);
      } catch (err) {
        res.status(500).json(err);
      }
    });
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
