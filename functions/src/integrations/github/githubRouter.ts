// src/integrations/github/githubRouter.ts
import express from "express";
import { handleGithubWebhook } from "./webhooks";
import { logger } from "../../common/logger";

export const githubRouter = express.Router();

githubRouter.post("/webhook", async (req, res) => {
  // TODO: add GitHub signature verification if needed
  res.status(200).send("OK");

  try {
    await handleGithubWebhook(req.body);
  } catch (err) {
    logger.error("Error handling GitHub webhook", err);
  }
});
