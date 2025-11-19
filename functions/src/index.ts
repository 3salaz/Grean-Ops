import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import express from "express";
import bodyParser from "body-parser";

import { slackRouter } from "./slack/slackRouter";
import { githubRouter } from "./github/webhookRouter";
import { trelloRouter } from "./trello/trelloRouter";
import { driveRouter } from "./drive/driveRouter";

const SLACK_SIGNING_SECRET = defineSecret("SLACK_SIGNING_SECRET");

const app = express();

// Slack MUST receive raw body exactly for signature verification
app.post(
  "/slack/events",
  bodyParser.raw({ type: "application/json" }),
  slackRouter
);

// All other routes use normal JSON
app.use(bodyParser.json());

app.post("/github/webhook", githubRouter);
app.post("/trello/sync", trelloRouter);
app.post("/drive/hooks", driveRouter);

export const api = onRequest(
  { secrets: [SLACK_SIGNING_SECRET] },
  app
);
