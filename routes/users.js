var express = require("express");
var router = express.Router();
const os = require("os");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  console.log(" in GET /user/register");
  const machineName = os.hostname();
  res.json({ machineName });
});

module.exports = router;
