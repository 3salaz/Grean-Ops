/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import crypto from "crypto";

export function verifySlackSignature(req: any, signingSecret: string) {
  const timestamp = req.headers["x-slack-request-timestamp"];
  const signature = req.headers["x-slack-signature"];
  const rawBody = req.rawBody; // MUST be the untouched Buffer

  if (!rawBody || !timestamp || !signature) {
    return false;
  }

  const baseString = `v0:${timestamp}:${rawBody.toString()}`;
  const hmac = crypto
    .createHmac("sha256", signingSecret)
    .update(baseString)
    .digest("hex");

  const computed = `v0=${hmac}`;

  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(signature)
  );
}
