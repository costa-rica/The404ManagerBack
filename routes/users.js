var express = require("express");
var router = express.Router();
const os = require("os");
const { checkBody } = require("../modules/checkbody");
const { createToken, verifyToken } = require("../modules/token");
const User = require("../models/user"); // Import model

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  console.log(" in GET /user/register");
  const machineName = os.hostname();
  res.json({ machineName });
});

router.post("/register", async (req, res) => {
  console.log("in POST /register");

  console.log("body", req.body.email);
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.create({ email, password });
    // res.status(201).json(user);
    console.log("user added successfully 👀");
  } catch (error) {
    console.log("failed: ", error.message);
    return res.status(400).json({ error: error.message });
  }

  const token = createToken({ user_id: 1 });

  console.log("token: ", token);

  res.json({ result: true, token });
});

module.exports = router;
