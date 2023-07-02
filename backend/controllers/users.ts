import express from "express";
import User from "../models/user";
import { Course, Enrollment } from "../models";
import { QueryTypes } from "sequelize";
import getUpdatedCourse from "../utils/getUpdatedCourse";
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await User.findAll({});
  res.json(users);
});

router.post("/", async (req, res, next) => {
  const { username, name, password, role, email } = req.body;
  const saltRounds = 10;
  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
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

// Function to allow users to sign up an account and join a course directly, perfect for teachers to send invite links to students and they can create their accounts and join the course instantly.

router.post("/directsignup/:id", async (req, res, next) => {
  const courseId = req.params.id;
  console.log(courseId);
  const course = await Course.findByPk(courseId);
  if (!course) {
    return res.status(404).send("Course not found");
  }

  // Creating user first
  const { username, name, password, email } = req.body;

  const saltRounds = 10;
  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username: username,
      name: name,
      passwordHash: passwordHash,
      role: "student",
      email: email,
    });

    // Now, to add the student to the course
    console.log(user);

    const userId = user.id;
    const courseId = course.id;

    const enrollmentQuery = `
      INSERT INTO "enrollments" ("id", "user_id", "course_id")
      VALUES (DEFAULT, $1, $2)
      RETURNING "id", "user_id", "course_id"
    `;
    const enrollment = await Enrollment.sequelize?.query(enrollmentQuery, {
      bind: [userId, courseId],
      type: QueryTypes.INSERT,
    });

    const editedCourse = await getUpdatedCourse(course.id);
    if (!editedCourse) {
      return res.status(404).send("Course not found");
    }
    return res.json(editedCourse);
  } catch (error) {
    next(error);
  }
});

export default router;
