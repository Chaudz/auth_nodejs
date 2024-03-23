import { Request, Response } from "express";
import { renderResponse } from "../helpers";

class TokenController {
  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body.token;
    if (!refreshToken) {
      return renderResponse(res, 401, "Refresh token is missing");
    }
  }
}
