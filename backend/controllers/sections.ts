import express from "express";
import { Section, User, File, Chapter } from "../models";
import { Course } from "../models";
import { nextTick } from "process";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";
import { Includeable } from "sequelize";
import { Op } from "sequelize";

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
      });

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
