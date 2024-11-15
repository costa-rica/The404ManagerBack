const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Secret key (replace this with a secure value or an environment variable)
const secretKey = process.env.SECRET_KEY;

function createToken(user) {
  // Here, we're adding the user ID to the token
  const payload = { userId: user.id };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error("Token is invalid or expired");
  }
}

// Function to search for a user by email
async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
  }
}

module.exports = { createToken, verifyToken, findUserByEmail };
