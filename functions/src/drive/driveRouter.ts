import {Request, Response} from "express";

export const driveRouter = (req: Request, res: Response) => {
  console.log("Drive webhook received:", req.body);
  return res.status(200).send("Drive OK");
};
