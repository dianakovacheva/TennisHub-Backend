const router = require("express").Router();
const user = require("./user");
const auth = require("./auth");
const clubs = require("./tennisClub");

router.use("/user", user);
router.use("/auth", auth);
router.use("/clubs", clubs);

module.exports = router;
