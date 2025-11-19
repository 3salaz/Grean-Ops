import * as functions from "firebase-functions";
import express from "express";


import {slackRouter} from "./slack/slackRouter";
import {githubRouter} from "./github/webhookRouter";
import {trelloRouter} from "./trello/trelloRouter";
import {driveRouter} from "./drive/driveRouter";

const app = express();
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
