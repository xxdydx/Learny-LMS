import express from "express";
import { Section, User, File, Chapter } from "../models";
import { Course } from "../models";
import { nextTick } from "process";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";
import { Includeable } from "sequelize";
import { Op } from "sequelize";
import getUpdatedCourse from "../utils/getUpdatedCourse";

const router = express.Router();

// To create sections for a chapter of a course
router.post(
  "/:id/sections",
  tokenExtractor,
  async (req: CustomRequest, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(404).send("You need to be logged in");
    }

    try {
      let chapter = await Chapter.findByPk(req.params.id);
      if (!chapter) {
        return res.status(404).send("Chapter not found");
      }

      let course = await Course.findByPk(chapter.courseId);

      if (user.id.toString() !== course?.teacherId.toString()) {
        return res
          .status(403)
          .send(`You don't have permissions to create sections`);
      }

      await Section.create({
        title: req.body.title,
        files: [],
        chapterId: chapter.id,
      });

      const editedCourse = await getUpdatedCourse(course.id);
      if (!editedCourse) {
        return res.status(404).send("Course not found");
      }
      return res.json(editedCourse);
    } catch (error) {
      next(error);
    }
  }
);

// to delete the chapter

router.delete("/:id", tokenExtractor, async (req: CustomRequest, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(404).send("You need to be logged in");
  }
  try {
    let chapter = await Chapter.findByPk(req.params.id);
    if (!chapter) {
      return res.status(404).send("Chapter not found");
    }
    let course = await Course.findByPk(chapter.courseId);

    if (user.id.toString() !== course?.teacherId.toString()) {
      return res
        .status(403)
        .send(`You don't have permissions to delete this chapter`);
    }

    await chapter.destroy();

    // Display the edited course after the chapter is deleted

    const editedCourse = await Course.findByPk(course.id, {
      attributes: { exclude: ["teacherId"] },
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["name", "username", "id"],
        },
        {
          model: User,
          as: "students",
          attributes: ["name", "username", "id"],
          through: {
            attributes: [],
          },
        },
        {
          model: Chapter,
          as: "chapters",
          attributes: ["title", "id"],
          include: [
            {
              model: Section,
              as: "sections",
              include: [
                {
                  model: File,
                  as: "files",
                  attributes: ["name", "id"],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json(editedCourse);
  } catch (err) {
    next(err);
  }
});

export default router;
