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
router.post("/chapters/:id/sections", async (req, res, next) => {
  try {
    let chapter = await Chapter.findByPk(req.params.id);
    if (!chapter) {
      return res.status(404).send("Chapter not found");
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
});

export default router;
