import {Request, Response} from "express";

export const slackRouter = (req: Request, res: Response) => {
  console.log("Slack event received:", req.body);

  // Slack URL verification
  if (req.body?.type === "url_verification") {
    return res.status(200).send(req.body.challenge);
  }

  return res.status(200).send("Slack OK");
};
