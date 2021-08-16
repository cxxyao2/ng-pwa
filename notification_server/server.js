const express = require("express");
const bodyParser = require("body-parser"); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require("cors");
const webpush = require("web-push");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const vapidKeys = {
  publicKey: "YOUR-OWN-PUBLIC-KEY",
  privateKey: "YOUR-OWN-PRIVATE-KEY",
};

webpush.setVapidDetails(
  "mailto:admin@your-organization.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var allSubscriptions = [];

app.route("/api/newsletter").post(sendNewsletter);
app.route("/api/subscribers").get(sendSubscribers);
app.route("/api/addSubscriber").post(addSubscriber);

function addSubscriber(req, res) {
  res.status(200).json({ message: "an new subscriber is added. " });
  if (allSubscriptions && !allSubscriptions.includes(req.body)) {
    allSubscriptions.push(req.body);
  }
}
function sendSubscribers(req, res) {
  res.status(200).json(allSubscriptions);
}

function sendNewsletter(req, res) {
  // TODO you should save subscriptions into database and get them from database.
  allSubscriptions = [
    {
      endpoint: "...",
      keys: {
        auth: "...",
        p256dh: "...",
      },
    },
  ];

  const notificationPayload = {
    notification: {
      title: "Angular News",
      body: "Newsletter Available!",
      icon: "assets/xxx.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
      actions: [
        {
          action: "explore",
          title: "Go to the site",
        },
      ],
    },
  };

  Promise.all(
    allSubscriptions.map((sub) =>
      webpush.sendNotification(sub, JSON.stringify(notificationPayload))
    )
  )
    .then(() =>
      res.status(200).json({ message: "Newsletter sent successfully." })
    )
    .catch((err) => {
      console.error("Error sending notification, reason: ", err);
      res.sendStatus(500);
    });
}

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

exports.sendNewsletter = sendNewsletter;
