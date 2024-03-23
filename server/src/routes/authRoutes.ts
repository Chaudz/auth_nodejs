import { Router } from "express";
import userController from "../controllers/authController";

const router = Router();

router.post("/register", userController.register);
router.post("/logout", userController.logout);
router.post("/login", userController.login);

export default router;
