/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";

export function verifySlackSignature(req: any, signingSecret: string) {
  const timestamp = req.headers["x-slack-request-timestamp"];
  const signature = req.headers["x-slack-signature"];

  // Firebase Gen-2: rawBody is the original Slack payload (Buffer)
  const rawBody: Buffer | undefined = req.rawBody;

  if (!rawBody || !timestamp || !signature) {
    return false;
  }

  const bodyString = rawBody.toString(); // exact bytes Slack signed

  const baseString = `v0:${timestamp}:${bodyString}`;
  const hmac = crypto
    .createHmac("sha256", signingSecret)
    .update(baseString)
    .digest("hex");

  const computed = `v0=${hmac}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch (e) {
    return false;
  }
}
