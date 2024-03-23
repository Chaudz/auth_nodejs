import { Router, Request, Response } from "express";
import { authToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authToken, (req: Request, res: Response) => {
  res.send("User created successfully");
});

export default router;
