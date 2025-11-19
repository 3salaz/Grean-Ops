import {Request, Response} from "express";

export const githubRouter = (req: Request, res: Response) => {
  console.log("GitHub webhook received:", req.body);
  return res.status(200).send("GitHub OK");
};
