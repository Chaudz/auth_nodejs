import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import UserNameValidator from "../helper/valid";
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
      console.log(userName, password);

      if (!UserNameValidator.validateUserName(userName)) {
        return res.status(400).json({ message: "Invalid userName format" });
      }

      if (!UserNameValidator.validatePassword(password)) {
        return res.status(400).json({ message: "Invalid password format" });
      }

      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return res.status(400).json({ message: "user already exists" });
      }

      const hashedPass = await bcrypt.hash(password, 10);

      const newUser = new User({
        userName,
        pass: hashedPass,
        firstName: firstName || "",
        lastName: lastName || "",
      });

      newUser.save();

      return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { password, userName }: UserType = req.body;
      const user = await User.findOne({
        userName,
      });

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      const matchPass = await bcrypt.compare(password, user.password);
      if (!matchPass) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const payload: IPayload = {
        userId: user._id.toString(),
        userName,
      };
      const token = jwt.sign(payload, `${process.env.AUTH_JWT}`, {
        expiresIn: "1h",
      });
      console.log(token);
      user.token = token;
      await user.save();

      return res
        .status(200)
        .json({ token, userId: user._id, message: "Login successful" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const tokenString = req.headers.authorization;
      if (!tokenString) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const verifyObj = jwt.verify(
        tokenString,
        `${process.env.AUTH_JWT}`
      ) as IPayload;
      if (!verifyObj) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      const user = await User.findById(verifyObj.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.token !== tokenString) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      user.token = "";
      await user.save();

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new UserController();
