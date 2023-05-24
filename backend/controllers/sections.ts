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

// To create files for a chapter of a course
router.post(
  "/:id/files",
  tokenExtractor,
  async (req: CustomRequest, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(404).send("You need to be logged in");
    }

    try {
      let section = await Section.findByPk(req.params.id);
      if (!section) {
        return res.status(404).send("Section not found");
      }
      let chapter = await Chapter.findByPk(section?.chapterId);
      let course = await Course.findByPk(chapter?.courseId);

      if (user.id.toString() !== course?.teacherId.toString()) {
        return res
          .status(403)
          .send(`You don't have permissions to create files`);
      }

      const file = await File.create({
        name: req.body.name,
        link: req.body.link,
        sectionId: section.id,
        awskey: req.body.awskey,
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

// to delete a section

router.delete("/:id", tokenExtractor, async (req: CustomRequest, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(404).send("You need to be logged in");
  }
  try {
    let section = await Section.findByPk(req.params.id);
    if (!section) {
      return res.status(404).send("Section not found");
    }
    let chapter = await Chapter.findByPk(section?.chapterId);
    let course = await Course.findByPk(chapter?.courseId);

    if (user.id.toString() !== course?.teacherId.toString()) {
      return res
        .status(403)
        .send(`You don't have permissions to delete this section`);
    }

    await section.destroy();

    // Display the edited course after the chapter is deleted
    const editedCourse = await getUpdatedCourse(course.id);
    if (!editedCourse) {
      return res.status(404).send("Course not found");
    }

    return res.json(editedCourse);
  } catch (err) {
    next(err);
  }
});

export default router;
