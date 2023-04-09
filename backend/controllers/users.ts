import express from "express";
import User from "../models/user";
import Course from "../models/course";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.findAll({});
  res.json(users);
});

router.post("/", async (req, res, next) => {
  const { username, name, password, role, email } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  try {
    const user = await User.create({
      username: username,
      name: name,
      passwordHash: passwordHash,
      role: role,
      email: email,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

export default router;
