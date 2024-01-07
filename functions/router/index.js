const router = require("express").Router();
const user = require("./user");
const auth = require("./auth");
const club = require("./club");
const booking = require("./booking");
const comments = require("./comments");

router.use("/user", user);
router.use("/auth", auth);
router.use("/club", club);
router.use("/booking", booking);
router.use("/comments", comments);

module.exports = router;
