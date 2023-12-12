
import express from "express";
import User from "../models/user";
import Session from "../models/session";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";


const router = express.Router();

router.get("/", tokenExtractor, async (req: CustomRequest, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).send("User not found");
  }

  try {
    // Check if user is an admin
    if (user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get all sessions
    const sessions = await Session.findAll({
      order: [['login_time', 'DESC']]
    });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }

});

export default router;

