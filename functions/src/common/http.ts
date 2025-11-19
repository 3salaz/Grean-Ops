export const ok = (res: any, message = "ok") =>
  res.status(200).send(message);
