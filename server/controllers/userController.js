const bcrypt = require("bcrypt");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const userController = {
  // Create new user (Sign up)
  signUp: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.create({ email, password });
      const token = signToken(user);
      res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong during sign up" });
    }
  },

  // Login user
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = signToken(user);
      res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong during login" });
    }
  },
};

module.exports = userController;
