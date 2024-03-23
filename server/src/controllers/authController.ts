import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import { UserNameValidator, renderResponse } from "../helpers/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IPayload {
  userId: string;
  userName: string;
}

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { userName, password, firstName, lastName }: UserType = req.body;

      if (
        !UserNameValidator.validatePassword(password) ||
        !UserNameValidator.validateUserName(userName)
      ) {
        return renderResponse(res, 400, "Invalid userName or password format");
      }

      const existingUser = await User.exists({ userName });
      if (existingUser) {
        return renderResponse(res, 400, "user already exists");
      }

      const hashedPass = await bcrypt.hash(
        password,
        `${process.env.SALT_BCRYPT}`
      );

      const newUser = new User({
        userName,
        pass: hashedPass,
        firstName: firstName || "",
        lastName: lastName || "",
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
      const token = jwt.sign(payload, `${process.env.AUTH_JWT}`, {
        expiresIn: `${process.env.EXPIRESIN}`,
      });
      user.token = token;
      await user.save();

      return renderResponse(res, 200, "Login successful", {
        token,
        userId: user._id,
      });
    } catch (error) {
      return renderResponse(res, 500, "Internal Server Error");
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const tokenString = req.headers.authorization;
      if (!tokenString) {
        return renderResponse(res, 401, "Unauthorized: No token provided");
      }

      const verifyObj = jwt.verify(
        tokenString,
        `${process.env.AUTH_JWT}`
      ) as IPayload;
      if (!verifyObj) {
        return renderResponse(res, 401, "Unauthorized: Invalid token");
      }

      const user = await User.findById(verifyObj.userId);
      if (!user) {
        return renderResponse(res, 404, "User not found");
      }

      if (user.token !== tokenString) {
        return renderResponse(res, 401, "Unauthorized: Invalid token");
      }

      user.token = "";
      await user.save();

      return renderResponse(res, 200, "Logout successful");
    } catch (error) {
      return renderResponse(res, 500, "Internal Server Error");
    }
  }
}

export default new UserController();
