import { Router, Request, Response } from "express";
import { isAdmin } from "../middleware/authMiddleware";

const router = Router();

router.post("/", isAdmin, (req: Request, res: Response) => {
  res.send("User created successfully");
});
