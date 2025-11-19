import * as functions from "firebase-functions";
import express from "express";
import { slackRouter } from "./slack/slackRouter";
import { githubRouter } from "./github/webhookRouter";
import { trelloRouter } from "./trello/trelloRouter";
import { driveRouter } from "./drive/driveRouter";
import getRawBody from "raw-body";

const app = express();

// Slack requires access to rawBody BEFORE JSON parsing:
app.use(async (req: any, res, next) => {
  try {
    req.rawBody = await getRawBody(req);
  } catch (e) {
    // ignore parsing raw body errors for non-json requests
  }
  next();
});

// Then parse JSON AFTER capturing rawBody
app.use(express.json());

// Slack Events
app.post("/slack/events", slackRouter);

// GitHub Webhooks
app.post("/github/webhook", githubRouter);

// Trello Sync
app.post("/trello/sync", trelloRouter);

// Google Drive Hooks
app.post("/drive/hooks", driveRouter);

export const api = functions.https.onRequest(app);