// src/integrations/slack/slackRouter.ts
import express from "express";
import { verifySlackSignature } from "./verifySignature";
import { handleSlackEvent } from "./events";
import { handleSlackCommand } from "./commands";
import { logger } from "../../common/logger";

export const slackRouter = express.Router();

// We manually parse from rawBody inside here (no express.json())

// URL verification + events
slackRouter.post("/events", async (req: any, res) => {
  const signature = req.headers["x-slack-signature"] as string | undefined;
  const timestamp = req.headers["x-slack-request-timestamp"] as
    | string
    | undefined;

  if (!verifySlackSignature({ rawBody: req.rawBody, timestamp, signature })) {
    logger.warn("Slack signature verification failed");
    return res.status(401).send("invalid signature");
  }

  let body: any;
  try {
    body = JSON.parse(req.rawBody.toString());
  } catch (err) {
    logger.error("Failed to parse Slack body as JSON", err);
    return res.status(400).send("bad request");
  }

  // URL verification challenge
  if (body.type === "url_verification") {
    return res.status(200).send(body.challenge);
  }

  // Acknowledge immediately to Slack
  res.status(200).send();

  // Process asynchronously
  try {
    await handleSlackEvent(body);
  } catch (err) {
    logger.error("Error handling Slack event", err);
  }

  // FIX: Ensure this function always returns
  return;
});

// Slash commands
slackRouter.post("/commands", async (req: any, res) => {
  const signature = req.headers["x-slack-signature"] as string | undefined;
  const timestamp = req.headers["x-slack-request-timestamp"] as
    | string
    | undefined;

  if (!verifySlackSignature({ rawBody: req.rawBody, timestamp, signature })) {
    logger.warn("Slack command signature verification failed");
    return res.status(401).send("invalid signature");
  }

  // Slack sends URL-encoded form for commands
  const bodyText = req.rawBody.toString("utf8");
  const params = new URLSearchParams(bodyText);
  const payload = Object.fromEntries(params.entries());

  try {
    const result = await handleSlackCommand(payload as any);
    return res.status(200).json(result);
  } catch (err) {
    logger.error("Error handling Slack command", err);
    return res.status(200).json({
      response_type: "ephemeral",
      text: "Something went wrong creating the client. Tell Kevin.",
    });
  }
});
