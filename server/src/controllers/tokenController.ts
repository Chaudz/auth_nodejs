import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { renderResponse } from "../helpers";
import Token from "../models/Token";

class TokenController {
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.body.token;
      if (!refreshToken) {
        return renderResponse(res, 401, "Refresh token is missing");
      }

      const existsToken = await Token.exists({ tokenValue: refreshToken });
      if (!existsToken) {
        return renderResponse(res, 403, "Refresh token is invalid");
      }

      jwt.verify(
        refreshToken,
        `${process.env.REFRESH_TOKEN_SECRET}`,
        async (err: Error | null, data: any) => {
          if (err) {
            return renderResponse(res, 403, "Refresh token is invalid");
          }

          const accessToken = jwt.sign(
            { userId: data.userId, userName: data.userName },
            `${process.env.TOKEN_SECRET}`,
            { expiresIn: "10s" }
          );
          const newRefreshToken = jwt.sign(
            { userId: data.userId },
            `${process.env.REFRESH_TOKEN_SECRET}`,
            { expiresIn: "30d" }
          );

          await Token.findOneAndUpdate(
            { tokenValue: refreshToken },
            { tokenValue: newRefreshToken }
          );

          return renderResponse(res, 200, "Refresh token is successful", {
            accessToken,
            RefreshToken: newRefreshToken,
          });
        }
      );
    } catch (error) {
      return renderResponse(res, 500, "Internal Server Error");
    }
  }
}

export default new TokenController();
