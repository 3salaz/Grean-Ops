// src/index.ts
import * as functions from "firebase-functions";
import dotenv from "dotenv";
import express from "express";
import getRawBody from "raw-body";

import { slackRouter } from "./integrations/slack/slackRouter";
import { trelloRouter } from "./integrations/trello/trelloRouter";
import { githubRouter } from "./integrations/github/githubRouter";

const app = express();

dotenv.config(); // Loads functions/.env into process.env

// -----------------------------------------------------
// SLACK RAW BODY CAPTURE (for signature verification)
// -----------------------------------------------------
// We do NOT run express.json() on /slack.* routes.
// Slack needs the exact raw body for v0 signing.
app.use("/slack", async (req: any, res, next) => {
  try {
    req.rawBody = await getRawBody(req);
  } catch (err) {
    console.error("Slack rawBody capture error", err);
  }
  next();
});

// Slack router (expects req.rawBody and handles its own JSON parsing)
app.use("/slack", slackRouter);

// -----------------------------------------------------
// Normal JSON parsing for everything else
// -----------------------------------------------------
app.use(express.json());

// Trello webhooks
app.use("/trello", trelloRouter);

// GitHub webhooks
app.use("/github", githubRouter);

// Basic health check
app.get("/", (req, res) => {
  res.status(200).send("Grean Ops API OK");
});

export const api = functions.https.onRequest(app);
