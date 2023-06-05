const { User } = require("../models");

module.exports = {
  // GET all users
  getUsers(req, res) {
    User.find()
      .select("-__v")
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

  // Create a new user
  createUser({ body }, res) {
    User.create(body)
      .then((userData) => res.json(userData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
