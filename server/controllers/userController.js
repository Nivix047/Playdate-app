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
};
