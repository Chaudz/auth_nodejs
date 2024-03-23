import { Router } from "express";
import tokenController from "../controllers/tokenController";

const router = Router();

router.post("/refeshToken", tokenController.refreshToken);

export default router;
