var express = require("express");
var router = express.Router();
const os = require("os");
const { checkBody } = require("../modules/checkbody");
const { createToken, verifyToken } = require("../modules/token");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  console.log(" in GET /user/register");
  const machineName = os.hostname();
  res.json({ machineName });
});

router.post("/register", (req, res) => {
  console.log("in POST /register");

  console.log("body", req.body.email);

  const token = createToken({ user_id: 1 });

  console.log("token: ", token);

  res.json({ result: true, token });
});

module.exports = router;
