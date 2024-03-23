import { Request, Response, NextFunction } from "express";
import { renderResponse } from "../helpers/index";
import jwt from "jsonwebtoken";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenString: string | undefined = req.headers.authorization;

    if (!tokenString) {
      return renderResponse(res, 401, "Unauthorized");
    }

    let verifyObj: any;

    try {
      verifyObj = jwt.verify(tokenString, `${process.env.AUTH_JWT}`);
    } catch (error) {
      return renderResponse(res, 401, "Invalid token");
    }

    if (!verifyObj) {
      return renderResponse(res, 401, "Unauthorized");
    }

    if (verifyObj?.userName === "admin") {
      next();
    } else {
      return renderResponse(res, 403, "Not an admin account");
    }
  } catch (error) {
    return renderResponse(res, 500, "Internal server error");
  }
};
