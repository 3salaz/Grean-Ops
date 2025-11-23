// src/integrations/slack/verifySignature.ts
import crypto from "crypto";
import { secrets } from "../../common/secrets";

const SLACK_VERSION = "v0";
const TOLERANCE_SECONDS = 60 * 5; // 5 minutes

export function verifySlackSignature({
  rawBody,
  timestamp,
  signature,
}: {
  rawBody: Buffer | string;
  timestamp?: string;
  signature?: string;
}): boolean {
  if (!timestamp || !signature) return false;

  const ts = parseInt(timestamp, 10);
  const now = Math.floor(Date.now() / 1000);

  // Replay protection
  if (Math.abs(now - ts) > TOLERANCE_SECONDS) return false;

  const basestring = `${SLACK_VERSION}:${timestamp}:${rawBody.toString()}`;
  const hmac = crypto
    .createHmac("sha256", secrets.slackSigningSecret)
    .update(basestring)
    .digest("hex");

  const expected = `${SLACK_VERSION}=${hmac}`;
  const safeCompare =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  return safeCompare;
}
