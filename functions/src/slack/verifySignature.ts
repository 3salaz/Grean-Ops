import {Request} from "express";
import * as crypto from "crypto";

export const verifySlackSignature = (
  req: Request,
  signingSecret: string
): boolean => {
  const timestamp = req.headers["x-slack-request-timestamp"] as string;
  const slackSignature = req.headers["x-slack-signature"] as string;

  if (!timestamp || !slackSignature) {
    return false;
  }

  // Prevent replay attacks (5 minute window)
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
  if (parseInt(timestamp, 10) < fiveMinutesAgo) {
    return false;
  }

  const rawBody = (req as any).rawBody?.toString();
  if (!rawBody) {
    return false;
  }

  const baseString = `v0:${timestamp}:${rawBody}`;

  const hmac = crypto.createHmac("sha256", signingSecret);
  hmac.update(baseString);
  const computed = `v0=${hmac.digest("hex")}`;

  return crypto.timingSafeEqual(
    Buffer.from(computed, "utf8"),
    Buffer.from(slackSignature, "utf8")
  );
};
