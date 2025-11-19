/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { verifySlackSignature } from "./verifySignature";

export const slackRouter = (req: Request, res: Response) => {
  // 1. URL Verification (no signature needed)
  if (req.body?.type === "url_verification") {
    console.log("Slack URL verification:", req.body);
    return res.status(200).send(req.body.challenge);
  }

  // 2. Verify signature for all other Slack events
  const signingSecret = process.env.SLACK_SIGNING_SECRET;

  if (!signingSecret) {
    console.error("SLACK_SIGNING_SECRET missing");
    return res.status(500).send("Missing secret");
  }

  const valid = verifySlackSignature(req, signingSecret);
  if (!valid) {
    console.warn("Invalid Slack signature");
    return res.status(401).send("Invalid signature");
  }

  // 3. Process Slack event
  console.log("Slack event received:", req.body);

  return res.status(200).send("OK");
};
