const { Group, User, Message } = require("../models");

module.exports = {
  // Create a new group
  async createGroup(req, res) {
    try {
      const groupData = await Group.create({
        name: req.body.name,
        users: req.body.users,
      });
      const userData = await User.updateMany(
        { _id: { $in: req.body.users } },
        { $addToSet: { group: groupData._id } },
        { multi: true, new: true }
      );
      res.json(groupData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a user to a group
  async addUserToGroup(req, res) {
    try {
      // Find the group and add the user to the group's user array
      const groupData = await Group.findByIdAndUpdate(
        req.params.groupId,
        { $addToSet: { users: req.params.userId } },
        { new: true }
      ).populate("users");

      // Find the user and add the group to the user's group array
      const userData = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { group: req.params.groupId } },
        { new: true }
      );

      // Return the updated group data
      res.json(groupData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Remove a user from a group
  async removeUserFromGroup(req, res) {
    try {
      // Find the group and remove the user from the group's user array
      const group = await Group.findById(req.params.groupId);
      group.users.pull(req.params.userId);
      await group.save();

      // Find the user and remove the group from the user's group array
      const user = await User.findById(req.params.userId);
      user.group.pull(req.params.groupId);
      await user.save();

      // Return the updated group data
      res.json(group);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Create a new message in a group
  createGroupMessage: async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupId);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      const { sender, body } = req.body;
      const message = await Message.create({
        sender,
        body,
        group: req.params.groupId,
      });
      group.messages.push(message._id);
      await group.save();
      res.json(message);
    } catch (err) {
      console.error(err);
      if (err.kind === "ObjectId") {
        return res.status(400).json({ error: "Invalid group or sender ID" });
      }
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get all messages for a group
  getGroupMessages: async (req, res) => {
    try {
      const messages = await Message.find({ group: req.params.groupId });
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};
