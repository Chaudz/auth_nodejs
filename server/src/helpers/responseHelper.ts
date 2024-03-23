import { Response } from "express";

export default function renderResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) {
  return res.status(statusCode).json({ message, data });
}
