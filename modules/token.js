const jwt = require("jsonwebtoken");

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

module.exports = { createToken, verifyToken };
