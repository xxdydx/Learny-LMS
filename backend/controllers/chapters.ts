import express from "express";
import { Section, User, File, Chapter } from "../models";
import { Course } from "../models";
import { nextTick } from "process";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";
import { Includeable } from "sequelize";
import { Op } from "sequelize";

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

      const section = await Section.create({
        title: req.body.title,
        files: [],
        chapterId: chapter.id,
      });

      return res.json(section);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
