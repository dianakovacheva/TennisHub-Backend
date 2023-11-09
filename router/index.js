const router = require("express").Router();
const user = require("./user");
const auth = require("./auth");
const recipes = require("./recipes");

router.use("/user", user);
router.use("/auth", auth);
router.use("/recipes", recipes);

module.exports = router;
