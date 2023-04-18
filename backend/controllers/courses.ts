import express from "express";
import { Section, User, File, Chapter } from "../models";
import { Course } from "../models";
import { nextTick } from "process";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";
import { Includeable } from "sequelize";

const router = express.Router();

// To get all courses
router.get("/", async (_req, res) => {
  const courses = await Course.findAll({
    attributes: { exclude: ["teacherId"] },
    include: [
      {
        model: User,
        as: "teacher",
        attributes: ["name", "username", "id"],
      },
      {
        model: Chapter,
        as: "chapters",
        attributes: ["title", "id"],
        include: [
          {
            model: Section,
            as: "sections",
          },
        ],
      },
    ],
  });
  res.send(courses);
});

// To create a brand new and empty course without any chapters
router.post("/", tokenExtractor, async (req: CustomRequest, res) => {
  try {
    const decodedToken = req.decodedToken;
    const userId =
      typeof decodedToken === "string" ? decodedToken : decodedToken?.id;
    const user = await User.findByPk(userId); // Use the extracted ID to find the user
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.role != "teacher") {
      return res
        .status(401)
        .send("Unauthorised. Contact support if you think this is a mistake.");
    }
    console.log(user.id);
    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      teacherId: user.id, // Assign the user's ID to the course
      chapters: [],
    });
    return res.json(course);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

// To update details of the course
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

// To create chapters for a course
router.post("/:id/chapters", async (req, res, next) => {
  try {
    let course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    const chapter = await Chapter.create({
      title: req.body.title,
      sections: [],
      courseId: course.id,
    });
    console.log(chapter);
    return res.json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
