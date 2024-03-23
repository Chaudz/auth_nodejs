import { Router } from "express";
import tokenController from "../controllers/tokenController";

const router = Router();

router.post("/refreshToken", tokenController.refreshToken);

export default router;
