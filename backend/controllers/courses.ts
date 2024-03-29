import express from "express";
import {
  Section,
  User,
  File,
  Chapter,
  Assignment,
  Submission,
} from "../models";
import { Course } from "../models";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";
import { Op } from "sequelize";
import getUpdatedCourse from "../utils/getUpdatedCourse";

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
        order: [
          ["createdAt", "DESC"],
          [{ model: Chapter, as: "chapters" }, "createdAt", "DESC"],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            "createdAt",
            "ASC",
          ],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            { model: File, as: "files" },
            "createdAt",
            "ASC",
          ],
        ],
      });
      return res.send(courses);
    }

    // GET courses created by a teacher
    if (user.role === "teacher") {
      const courses = await Course.findAll({
        attributes: { exclude: ["teacherId"] },
        where: {
          teacherId: {
            [Op.eq]: user.id,
          },
          template: { [Op.not]: true },
        },

        include: [
          {
            model: User,
            as: "teacher",
            attributes: ["name", "username", "id", "email", "role"],
          },
          {
            model: User,
            as: "students",
            attributes: ["name", "username", "id", "email", "role"],
            through: {
              attributes: [],
            },
          },
          {
            model: Chapter,
            as: "chapters",
            attributes: ["title", "id", "createdAt", "pinned"],
            include: [
              {
                model: Section,
                as: "sections",
                include: [
                  {
                    model: File,
                    as: "files",
                  },
                  {
                    model: Assignment,
                    as: "assignments",
                    include: [
                      {
                        model: Submission,
                        as: "submissions",
                        required: false,
                        include: [
                          {
                            model: User,
                            as: "student",
                            attributes: [
                              "name",
                              "username",
                              "id",
                              "email",
                              "role",
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        order: [
          ["createdAt", "DESC"],
          [{ model: Chapter, as: "chapters" }, "createdAt", "DESC"],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            "createdAt",
            "ASC",
          ],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            { model: File, as: "files" },
            "createdAt",
            "ASC",
          ],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            { model: Assignment, as: "assignments" },
            "createdAt",
            "ASC",
          ],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            { model: Assignment, as: "assignments" },
            { model: Submission, as: "submissions" },
            "createdAt",
            "ASC",
          ],
        ],
      });

      return res.send(courses);
    }

    // GET students' courses
    if (user.role === "student") {
      const courses = await Course.findAll({
        attributes: { exclude: ["teacherId"] },
        where: {
          template: { [Op.not]: true },
        },
        include: [
          {
            model: User,
            as: "teacher",
            attributes: ["name", "username", "id", "email", "role"],
          },
          {
            model: User,
            as: "students",
            where: {
              id: {
                [Op.eq]: user.id,
              },
            },
            attributes: ["name", "username", "id", "email", "role"],
            through: {
              attributes: [],
            },
          },
          {
            model: Chapter,
            as: "chapters",
            attributes: ["title", "id", "pinned"],
            include: [
              {
                model: Section,
                as: "sections",

                include: [
                  {
                    model: File,
                    as: "files",
                    required: false,
                    where: {
                      visibledate: {
                        [Op.lt]: new Date().toISOString(),
                      },
                    },
                  },
                  {
                    model: Assignment,
                    as: "assignments",
                    required: false,
                    where: {
                      visibledate: {
                        [Op.lt]: new Date().toISOString(),
                      },
                    },
                    include: [
                      {
                        model: Submission,
                        as: "submissions",
                        required: false,
                        where: {
                          studentId: {
                            [Op.eq]: user.id,
                          },
                        },
                        include: [
                          {
                            model: User,
                            as: "student",
                            attributes: [
                              "name",
                              "username",
                              "id",
                              "email",
                              "role",
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        order: [
          ["createdAt", "DESC"],
          [{ model: Chapter, as: "chapters" }, "createdAt", "DESC"],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            "createdAt",
            "ASC",
          ],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            { model: File, as: "files" },
            "createdAt",
            "ASC",
          ],
          [
            { model: Chapter, as: "chapters" },
            { model: Section, as: "sections" },
            { model: Assignment, as: "assignments" },
            "createdAt",
            "ASC",
          ],
        ],
      });
      return res.send(courses);
    }
  } catch (err) {
    return next(err);
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
      template: false, // to certify this is a live course, not a template
      chapters: [],
    });
    return res.json(course);
  } catch (error) {
    // Handle any errors that occur
    return next(error);
  }
});

// To update details of the course
router.put("/:id", tokenExtractor, async (req: CustomRequest, res, next) => {
  const user = req.user;
  let course = await Course.findByPk(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  if (!course) {
    return res.status(404).send("Course not found");
  }
  // to ensure only creator of course can edit it
  if (user.id.toString() !== course.teacherId.toString()) {
    return res.status(401).send("No permissions to edit course");
  }
  course.set(req.body);
  try {
    await course.save();
    const editedCourse = await getUpdatedCourse(course.id);
    if (!editedCourse) {
      return res.status(404).send("Course not found");
    }
    return res.json(editedCourse);
  } catch (error) {
    return next(error);
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
    return next(error);
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

      await Chapter.create({
        title: req.body.title,
        sections: [],
        courseId: course.id,
        pinned: req.body.pinned,
      });

      const editedCourse = await getUpdatedCourse(course.id);
      if (!editedCourse) {
        return res.status(404).send("Course not found");
      }
      return res.json(editedCourse);
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
