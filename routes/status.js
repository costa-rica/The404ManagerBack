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

      if (list.length == 0) {
        return res.json({ result: true, appsList: fauxData });
      }
      // using map like this appends a {} for each 'app' in list
      const apps = list.map((app) => ({
        id: app.pm_id,
        name: app.name,
        status: app.pm2_env.status,
        port: app.pm2_env?.PORT,
        appProjectPath: app.pm2_env.pm_cwd ?? "no cwd",
      }));

      // return res.json(apps);
      return res.json({ result: true, appsList: apps });
    });
  });
});

router.post("/toggleApp", (req, res) => {
  console.log(`- in POST /toggleApp`);
  const { appName } = req.body;
  console.log(`appName: ${appName} ✅`);

  pm2.connect((err) => {
    if (err) {
      console.error("Error connecting to PM2:", err);
      return res
        .status(500)
        .json({ result: false, error: "Failed to connect to PM2" });
    }

    // Check the app's status
    pm2.describe(appName, (err, processDescription) => {
      if (err || !processDescription || processDescription.length === 0) {
        pm2.disconnect(); // Always disconnect after interacting with PM2
        console.error("Error retrieving app status:", err);
        return res
          .status(404)
          .json({ result: false, error: `App "${appName}" not found` });
      }
      console.log(`--> processDescription:`);
      console.log(processDescription);
      const appStatus = processDescription[0].pm2_env.status;
      console.log(`--> appStatus:`);
      console.log(appStatus);

      if (appStatus === "online") {
        // Stop the app if it's running
        pm2.stop(appName, (err) => {
          pm2.disconnect();
          if (err) {
            console.error("Error stopping app:", err);
            return res
              .status(500)
              .json({ result: false, error: "Failed to stop app" });
          }
          return res.json({ result: true, appName, status: "stopped" });
        });
      } else {
        // Start the app if it's not running
        pm2.start(appName, (err) => {
          pm2.disconnect();
          if (err) {
            console.error("Error starting app:", err);
            return res
              .status(500)
              .json({ result: false, error: "Failed to start app" });
          }
          return res.json({ result: true, appName, status: "started" });
        });
      }
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

const fauxData = [
  {
    id: 11,
    name: "FunkyChicken",
    status: "stopped",
  },
  {
    id: 13,
    name: "DevelopmentWebApp02",
    status: "online",
    port: 9992,
  },
  {
    id: 14,
    name: "The404ManagerBack",
    status: "online",
    port: 9999,
  },
];

module.exports = router;
