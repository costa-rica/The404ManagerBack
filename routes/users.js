var express = require("express");
var router = express.Router();
const os = require("os");
const { checkBody } = require("../modules/checkbody");
const {
  createToken,
  verifyToken,
  findUserByEmail,
} = require("../modules/token");
const User = require("../models/user");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// router.get("/register", (req, res) => {
//   console.log(" in GET /user/register");
//   const machineName = os.hostname();
//   res.json({ machineName });
// });

router.post("/register", async (req, res) => {
  console.log("in POST /register");

  console.log(`accdpted emails: ${process.env.ACCEPTED_EMAILS}`);

  const acceptedEmails = process.env.ACCEPTED_EMAILS;
  // ? process.env.ACCEPTED_EMAILS.split(",")
  // : [];
  console.log(`acceptedEmails: ${acceptedEmails}`);
  // console.log(`tyepof acceptedEmails: ${typeof acceptedEmails[0]}`);
  const isAcceptedEmail = acceptedEmails.includes(req.body.email);
  console.log("isAcceptedEmail: ", isAcceptedEmail);
  console.log("body.email", req.body.email);
  console.log("body", req.body.password);
  if (!isAcceptedEmail) {
    return res.status(401).json({ message: "This email is not accepted" });
  }

  const email = req.body.email;
  const passwordHashed = bcrypt.hashSync(req.body.password, 10);

  try {
    const user = await User.create({ email, password: passwordHashed });
    // res.status(201).json(user);
    console.log("user added successfully 👀");
  } catch (error) {
    console.log("failed: ", error.message);
    return res.status(400).json({ message: error.message });
  }

  console.log(`user.id: ${user.id}`);

  const token = createToken({ user_id: 1 });

  console.log("token: ", token);

  res.json({ result: true, token });
});

router.post("/login", async (req, res) => {
  console.log("in POST /login");

  console.log("body", req.body.email);
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await findUserByEmail(email);
    console.log("user.email: ", user.email);
    console.log("user.password: ", user.password);

    console.log(`user.id: ${user.id}`);
    // check password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      console.log("wrong password");
      return res
        .status(401)
        .json({ result: false, message: "Mot de passe erroné" });
    }

    const token = createToken({ user_id: user.id });

    console.log("token: ", token);
    return res.json({ result: true, message: "found user", token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
