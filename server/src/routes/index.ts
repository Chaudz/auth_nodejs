import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

router.post("/register", userController.register);
router.post("/logout", userController.logout);
router.post("/login", userController.login);

export default router;
