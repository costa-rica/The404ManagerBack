var express = require("express");
var router = express.Router();
const os = require("os");
const { checkBody } = require("../modules/checkbody");

const fs = require("fs");
const path = require("path");

// Route to read and return the syslog file
router.get("/syslog", async (req, res) => {
  const syslogPath = "/var/log/syslog";

  try {
    // Asynchronously read the file
    const data = await fs.promises.readFile(syslogPath, "utf8");

    // Return the file content as plain text
    res.setHeader("Content-Type", "text/plain");
    // res.send(data);
    return res.json({ result: true, data });
  } catch (error) {
    console.error("Error reading syslog:", error);

    // Handle errors, such as permission issues or file not found
    return res
      .status(500)
      .json({ result: false, error: "Unable to read syslog file." });
  }
});

module.exports = router;
