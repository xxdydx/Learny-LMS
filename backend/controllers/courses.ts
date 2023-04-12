import express from "express";
import Course from "../models/course";
import Chapter from "../models/chapter";
import Section from "../models/section";
import File from "../models/file";
import User from "../models/user";
import { nextTick } from "process";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";

const router = express.Router();

router.get("/", async (_req, res) => {
  const courses = await Course.findAll({});
  console.log(courses);
  res.send(courses);
});

router.post("/", tokenExtractor, async (req: CustomRequest, res) => {
  try {
    const decodedToken = req.decodedToken;
    const userId =
      typeof decodedToken === "string" ? decodedToken : decodedToken?.id;
    const user = await User.findByPk(userId); // Use the extracted ID to find the user
    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log(user.id);
    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      teacher: user.id, // Assign the user's ID to the course
    });
    return res.json(course);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

router.put("/:id", async (req, res, next) => {
  let course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).send("Course not found");
  }
  course.set(req.body);
  try {
    await course.save();
    res.status(200).send(course);
  } catch (error) {
    next(error);
  }
});

export default router;
