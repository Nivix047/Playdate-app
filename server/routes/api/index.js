const router = require("express").Router();
const messageRoutes = require("./messageRoutes");
const userRoutes = require("./userRoutes");
const groupRoutes = require("./groupRoutes");

router.use("/messages", messageRoutes);
router.use("/users", userRoutes);
router.use("/groups", groupRoutes);

module.exports = router;
