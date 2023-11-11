import express from "express";
import { Section, User, File, Chapter, Assignment } from "../models";
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

// to edit the chapter
router.put("/:id", tokenExtractor, async (req: CustomRequest, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(404).send("You need to be logged in");
  }

  try {
    let chapter = await Chapter.findByPk(req.params.id);
    if (!chapter) {
      return res.status(404).send("Chapter not found");
    }
    let course = await Course.findByPk(chapter?.courseId);

    // check if user has permissions to edit file, only creator of the course can edit the file
    if (user.id.toString() !== course?.teacherId.toString()) {
      return res
        .status(403)
        .send(`You don't have permissions to edit this chapter`);
    }

    chapter.set(req.body);
    await chapter.save();
    const editedCourse = await getUpdatedCourse(course.id);
    if (!editedCourse) {
      return res.status(404).send("Course not found");
    }

    return res.json(editedCourse);
  } catch (error) {
    return next(error);
  }
});

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
    const editedCourse = await getUpdatedCourse(course.id);
    if (!editedCourse) {
      return res.status(404).send("Course not found");
    }

    return res.json(editedCourse);
  } catch (err) {
    next(err);
  }
});

// to copy-paste chapter and add it to another course
router.post("/:id/copy", tokenExtractor, async (req: CustomRequest, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(404).send("You need to be logged in");
  }
  try {
    const chapter = await Chapter.findByPk(req.params.id, {
      include: [
        {
          model: Section,
          include: [
            {
              model: File,
            },
            {
              model: Assignment,
              as: "assignments",
            },
          ],
        },
      ],
    });
    if (!chapter) {
      return res.status(404).send("Chapter not found");
    }

    const course = await Course.findByPk(chapter.courseId);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    if (user.id.toString() !== course.teacherId.toString()) {
      return res
        .status(403)
        .send(`You don't have permissions to copy this chapter`);
    }

    const newCourseId = req.body.newCourseId;
    if (!newCourseId) {
      return res.status(400).send("New course ID (course you're pasting the chapter to) is required");
    }

    const newCourse = await Course.findByPk(newCourseId);
    if (!newCourse) {
      return res.status(404).send("New course not found");
    }

    if (user.id.toString() !== newCourse.teacherId.toString()) {
      return res
        .status(403)
        .send(`You don't have permissions to copy this chapter to this course.`);
    }

    const newChapter = await Chapter.create({
      title: chapter.title,
      courseId: newCourse.id
    });

    const newSections = await Promise.all(
      chapter.sections.map(async (section) => {
        const newSection = await Section.create({
          title: section.title,
          chapterId: newChapter.id
        });

        if (section.files) {
          const newFiles = await Promise.all(
            section.files.map(async (file) => {
              const newFile = await File.create({
                name: file.name,
                link: file.link,
                sectionId: newSection.id,
                awskey: file.awskey,
                visibledate: file.visibledate,
              });
              return newFile;
            })
          );
          newSection.setDataValue("files", newFiles);
        }
        
        if (section.assignments) {
          const newDeadline = new Date();
          newDeadline.setDate(newDeadline.getDate() + 21);

          const newAssignments = await Promise.all(
            section.assignments.map(async (assignment) => {
              const newAssignment = await Assignment.create({
                name: assignment.name,
                instructions: assignment.instructions,
                awskey: assignment.awskey,
                marks: assignment.marks,
                link: assignment.link,
                deadline: new Date(assignment.deadline) < new Date() ? newDeadline : assignment.deadline,
                visibledate: assignment.visibledate,
                sectionId: newSection.id,
              });
              return newAssignment;
            })
          );
          newSection.setDataValue("assignments", newAssignments);
        }

        return newSection;
      })
    );

    newChapter.setDataValue("sections", newSections);

    return res.json(newChapter);
  } catch (err) {
    next(err);
  }
});
export default router;
