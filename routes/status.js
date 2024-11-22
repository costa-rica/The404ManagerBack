var express = require("express");
var router = express.Router();
const os = require("os");
const { checkBody } = require("../modules/checkbody");
const pm2 = require("pm2");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/list-apps", (req, res) => {
  const machineName = os.hostname();

  pm2.connect((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to connect to PM2" });
    }

    pm2.list((err, list) => {
      pm2.disconnect(); // Disconnect PM2
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Failed to retrieve app list" });
      }

      // Map the list to include only relevant details
      const apps = list.map((app) => ({
        id: app.pm_id,
        name: app.name,
        status: app.pm2_env.status, // Optionally include status (e.g., online, stopped)
      }));

      res.json(apps);
    });
  });
});

// Route to start the Flask app
router.post("/start-flask", (req, res) => {
  const { appName } = req.body; // Example: { "appName": "FlaskApp" }

  pm2.connect((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Failed to connect to PM2" });
    }

    pm2.start(appName, (err) => {
      pm2.disconnect(); // Disconnect from PM2 after the operation
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ error: `Failed to start app: ${appName}` });
      }
      res.send({ message: `App ${appName} started successfully` });
    });
  });
});

module.exports = router;
