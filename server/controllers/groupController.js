const { Group, User, Message } = require("../models");

module.exports = {
  // Create a new group
  async createGroup(req, res) {
    try {
      console.log("req.user._id:", req.user._id);
      // Include only the logged-in user in the group
      let users = [req.user._id];

      const groupData = await Group.create({
        name: req.body.name,
        users: users,
      });
      console.log("groupData:", groupData);
      // Update the logged-in user's (the creator's) group field
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $addToSet: { groups: groupData._id } },
        { new: true }
      );

      console.log("updatedUser:", updatedUser);

      // Add the group invites to all other users
      let inviteUsers = Array.isArray(req.body.users) ? req.body.users : [];
      if (inviteUsers.length > 0) {
        await User.updateMany(
          { _id: { $in: inviteUsers } },
          { $addToSet: { groupInvites: groupData._id } },
          { multi: true, new: true }
        );
      }

      // Here, add the inviting user to the group's users array
      await Group.findByIdAndUpdate(
        groupData._id,
        { $addToSet: { users: req.user._id } },
        { new: true }
      );

      res.json(groupData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Invite a user to a group
  async inviteUserToGroup(req, res) {
    try {
      const group = await Group.findById(req.params.groupId);
      const user = await User.findById(req.params.userId);

      // Check if the user is already a member of the group
      if (group.users.includes(req.params.userId)) {
        return res
          .status(400)
          .json({ message: "User is already a member of this group." });
      }

      // Check if the user has already been invited to the group
      if (group.invites.includes(req.params.userId)) {
        return res
          .status(400)
          .json({ message: "User has already been invited to this group." });
      }

      // Add the invite to the group's invite array
      group.invites.push(req.params.userId);
      await group.save();

      // Add the group invite to the user's groupInvites array
      user.groupInvites.push(req.params.groupId);
      await user.save();

      // Also, add the logged-in user (who sends the invite) to the group
      await Group.findByIdAndUpdate(
        req.params.groupId,
        { $addToSet: { users: req.user._id } },
        { new: true }
      );

      res.json(group);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Accept a group invite
  async acceptGroupInvite(req, res) {
    try {
      const user = await User.findById(req.params.userId).select(
        "groupInvites groups"
      );
      const group = await Group.findById(req.params.groupId).select(
        "invites users"
      );

      if (!user || !group) {
        return res.status(404).json({ message: "User or group not found." });
      }

      // Check if the user is already a member of the group
      if (group.users && group.users.includes(req.params.userId)) {
        return res
          .status(400)
          .json({ message: "User is already a member of this group." });
      }

      // Check if the invite is in the user's groupInvites array
      if (
        !user.groupInvites ||
        !user.groupInvites.includes(req.params.groupId)
      ) {
        return res
          .status(400)
          .json({ message: "No invite from this group found." });
      }

      // Ensure groupInvites array exists before trying to modify it
      user.groupInvites = user.groupInvites || [];
      user.groupInvites = user.groupInvites.filter(
        (id) => id.toString() !== req.params.groupId
      );
      user.groups = user.group || [];
      user.groups.push(req.params.groupId);
      await user.save();

      // Ensure invites array exists before trying to modify it
      group.invites = group.invites || [];
      group.invites = group.invites.filter(
        (id) => id.toString() !== req.params.userId
      );
      group.users = group.users || [];
      group.users.push(req.params.userId);
      await group.save();

      res.json(group);
    } catch (err) {
      console.error(err);
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
        { $addToSet: { groups: req.params.groupId } },
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

      // Find the user and remove the group from the user's groups array
      const user = await User.findById(req.params.userId);
      user.groups.pull(req.params.groupId);
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
