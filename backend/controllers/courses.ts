import express from "express";
import Course from "../models/course";
import Chapter from "../models/chapter";
import Section from "../models/section";
import File from "../models/file";

const router = express.Router();

router.get("/", (_req, res) => {
  const courses = Course.findAll();
  res.send(courses);
});

router.post("/", async (req, res) => {
  const course = await Course.create({
    title: req.body.title,
    teacher: req.body.teacher,
    description: req.body.description,
  });
  return res.json(course);
});
