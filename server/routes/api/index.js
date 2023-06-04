const router = require("express").Router();
const messageRoutes = require("./messageRoutes");
const userRoutes = require("./userRoutes");

router.use("/messages", messageRoutes);
router.use("/users", userRoutes);

module.exports = router;
