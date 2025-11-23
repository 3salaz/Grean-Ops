import {Request, Response} from "express";

export const trelloRouter = (req: Request, res: Response) => {
  console.log("Trello webhook received:", req.body);
  return res.status(200).send("Trello OK");
};
