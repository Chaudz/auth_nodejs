import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import { UserValidator, renderResponse } from "../helpers/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../models/Token";
import TokenTypes from "../enums/tokenType.enum";

export interface IPayload {
  userId: string;
  userName: string;
}

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { userName, password, firstName, lastName }: UserType = req.body;

      if (
        !UserValidator.validatePassword(password) ||
        !UserValidator.validateUserName(userName)
      ) {
        return renderResponse(res, 400, "Invalid userName or password format");
      }

      const existingUser = await User.exists({ userName });
      if (existingUser) {
        return renderResponse(res, 400, "user already exists");
      }

      const hashedPassword = await bcrypt.hash(
        password,
        Number.parseInt(process.env.SALT_BCRYPT as string)
      );

      const newUser = new User({
        userName,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
      });
      newUser.save();

      return renderResponse(res, 201, "User registered successfully", newUser);
    } catch (error) {
      return renderResponse(res, 500, "Internal Server Error");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { password, userName }: UserType = req.body;
      const user = await User.findOne({
        userName,
      });

      if (!user) {
        return renderResponse(res, 404, "User not found");
      }

      const matchPass = await bcrypt.compare(password, user.password);
      if (!matchPass) {
        return renderResponse(res, 401, "Incorrect password");
      }

      const payload: IPayload = {
        userId: user._id.toString(),
        userName,
      };

      const accessToken = jwt.sign(
        payload,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {
          expiresIn: "15s",
        }
      );

      const refeshToken = jwt.sign(
        payload,
        `${process.env.REFRESH_TOKEN_SECRET}`,
        {
          expiresIn: "30d",
        }
      );

      const token = new Token({
        tokenType: TokenTypes.Refresh,
        tokenValue: refeshToken,
        userId: payload.userId,
      });
      await token.save();

      return renderResponse(res, 200, "Login successful", {
        accessToken,
        refeshToken,
        userId: user._id,
      });
    } catch (error) {
      return renderResponse(res, 500, "Internal Server Error");
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.headers.authorization;
      if (!refreshToken) {
        return renderResponse(res, 401, "Unauthorized: No token provided");
      }

      const verifyObj = jwt.verify(
        refreshToken,
        `${process.env.REFRESH_TOKEN_SECRET}`
      ) as IPayload;
      if (!verifyObj) {
        return renderResponse(res, 401, "Unauthorized: Invalid token");
      }

      await Token.findOneAndDelete({ tokenValue: refreshToken });

      return renderResponse(res, 200, "Logout successful");
    } catch (error) {
      return renderResponse(res, 500, "Internal Server Error");
    }
  }
}

export default new UserController();
