import express from "express";
import { Section, User, File, Chapter, Enrollment } from "../models";
import { Course } from "../models";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";
import { Op } from "sequelize";

const router = express.Router();

// To get courses
router.get("/", tokenExtractor, async (req: CustomRequest, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).send("User not found");
    }
    // GET all courses for admin users
    if (user.role === "admin") {
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
                include: [
                  {
                    model: File,
                    as: "files",
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
        ],
      });
      res.send(courses);
    }

    // GET courses created by a teacher
    if (user.role === "teacher") {
      const courses = await Course.findAll({
        attributes: { exclude: ["teacherId"] },
        where: {
          teacherId: {
            [Op.eq]: user.id,
          },
        },
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
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
        ],
      });
      res.send(courses);
    }
  } catch (err) {
    next(err);
  }
});

// To create a brand new and empty course without any chapters
router.post("/", tokenExtractor, async (req: CustomRequest, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send("User not found");
    }
    if (user.role != "teacher") {
      return res
        .status(401)
        .send(
          "You don't have permissions to create courses. Contact support if you think this is a mistake."
        );
    }

    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      teacherId: user.id, // Assign the user's ID to the course
      chapters: [],
    });
    return res.json(course);
  } catch (error) {
    // Handle any errors that occur
    next(error);
  }
});

// To create chapters for a course
router.post(
  "/:id/chapters",
  tokenExtractor,
  async (req: CustomRequest, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(404).send("You need to be logged in");
    }
    try {
      let course = await Course.findByPk(req.params.id);
      if (!course) {
        return res.status(404).send("Course not found");
      }
      if (user.id.toString() !== course.teacherId.toString()) {
        return res
          .status(403)
          .send(`You don't have permissions to create chapters`);
      }

      const chapter = await Chapter.create({
        title: req.body.title,
        sections: [],
        courseId: course.id,
      });

      return res.json(chapter);
    } catch (err) {
      next(err);
    }
  }
);

// To update details of the course
router.put("/:id", tokenExtractor, async (req, res, next) => {
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

// To delete course
router.delete("/:id", tokenExtractor, async (req: CustomRequest, res, next) => {
  const user = req.user;
  let course = await Course.findByPk(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  if (!course) {
    return res.status(404).send("Course not found");
  }
  if (user.id.toString() !== course.teacherId.toString()) {
    return res.status(401).send("No permissions to delete course");
  }

  try {
    await course.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
