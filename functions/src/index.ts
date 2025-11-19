import * as functions from "firebase-functions";
import express from "express";
import getRawBody from "raw-body";

import {slackRouter} from "./slack/slackRouter";
import {githubRouter} from "./github/webhookRouter";
import {trelloRouter} from "./trello/trelloRouter";
import {driveRouter} from "./drive/driveRouter";

const app = express();

// --------------------------------------------------------
// RAW BODY HANDLING — REQUIRED FOR SLACK SIGNATURE VERIFY
// --------------------------------------------------------
app.use((req: any, res, next) => {
  // Only capture raw body for Slack events
  if (req.url === "/slack/events") {
    getRawBody(req)
      .then((buf) => {
        req.rawBody = buf; // <— store exact bytes
        next();
      })
      .catch((err) => {
        console.error("Error capturing raw body:", err);
        next();
      });
  } else {
    next();
  }
});

// Parse JSON AFTER capturing rawBody
app.use(express.json());

// Routes
app.post("/slack/events", slackRouter);
app.post("/github/webhook", githubRouter);
app.post("/trello/sync", trelloRouter);
app.post("/drive/hooks", driveRouter);

export const api = functions.https.onRequest(app);

