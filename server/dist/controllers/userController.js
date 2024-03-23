"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const valid_1 = __importDefault(require("../helper/valid"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName, pass, firstName, lastName } = req.body;
                console.log(userName, pass);
                if (!valid_1.default.validateUserName(userName)) {
                    return res.status(400).json({ message: "Invalid userName format" });
                }
                if (!valid_1.default.validatePassword(pass)) {
                    return res.status(400).json({ message: "Invalid password format" });
                }
                const existingUser = yield User_1.default.findOne({ userName });
                if (existingUser) {
                    return res.status(400).json({ message: "user already exists" });
                }
                const hashedPass = yield bcrypt_1.default.hash(pass, 10);
                const newUser = new User_1.default({
                    userName,
                    pass: hashedPass,
                    firstName: firstName || "",
                    lastName: lastName || "",
                });
                newUser.save();
                return res
                    .status(201)
                    .json({ message: "User registered successfully", user: newUser });
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pass, userName } = req.body;
                const user = yield User_1.default.findOne({
                    userName,
                });
                if (!user) {
                    return res.status(404).json({ message: "user not found" });
                }
                const matchPass = yield bcrypt_1.default.compare(pass, user.pass);
                if (!matchPass) {
                    return res.status(401).json({ message: "Incorrect password" });
                }
                const payload = {
                    userId: user._id.toString(),
                    userName,
                };
                const token = jsonwebtoken_1.default.sign(payload, `${process.env.AUTH_JWT}`, {
                    expiresIn: "1h",
                });
                console.log(token);
                user.token = token;
                yield user.save();
                return res
                    .status(200)
                    .json({ token, userId: user._id, message: "Login successful" });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenString = req.headers.authorization;
                if (!tokenString) {
                    return res
                        .status(401)
                        .json({ message: "Unauthorized: No token provided" });
                }
                const verifyObj = jsonwebtoken_1.default.verify(tokenString, `${process.env.AUTH_JWT}`);
                if (!verifyObj) {
                    return res.status(401).json({ message: "Unauthorized: Invalid token" });
                }
                const user = yield User_1.default.findById(verifyObj.userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                if (user.token !== tokenString) {
                    return res.status(401).json({ message: "Unauthorized: Invalid token" });
                }
                user.token = "";
                yield user.save();
                res.status(200).json({ message: "Logout successful" });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new UserController();
