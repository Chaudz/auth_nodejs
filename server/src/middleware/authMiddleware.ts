import { Request, Response, NextFunction } from "express";
import { renderResponse } from "../helpers/index";
import jwt from "jsonwebtoken";

export const authToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenString: string | undefined = req.headers.authorization;

    if (!tokenString) {
      return renderResponse(res, 401, "Unauthorized");
    }

    jwt.verify(tokenString, `${process.env.ACCESS_TOKEN_SECRET}`, (err, _) => {
      if (err) return renderResponse(res, 403, "Unauthorized ");
      next();
    });
  } catch (error) {
    return renderResponse(res, 500, "Internal server error");
  }
};
