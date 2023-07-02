import express from "express";
import { Section, User, File, Chapter, Course, Enrollment } from "../models";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";
import { QueryTypes } from "sequelize";
import getUpdatedCourse from "../utils/getUpdatedCourse";

const router = express.Router();

router.get("/", async (req, res) => {
  const enrollments = await Enrollment.findAll({});
  res.json(enrollments);
});

// To enroll a student into the course
router.post("/", tokenExtractor, async (req: CustomRequest, res, next) => {
  try {
    // Check if logged in user (aka the teacher) has permissions to add students
    const teacher = req.user;
    const course = await Course.findByPk(req.body.courseId);
    if (!teacher) {
      return res.status(401).send("User not logged in");
    }
    if (!course) {
      return res.status(404).send("Course not found");
    }
    if (teacher.id.toString() !== course.teacherId.toString()) {
      return res
        .status(403)
        .send(`You don't have permissions to add students to this course.`);
    }

    // Check if student exists

    const student = await User.findOne({
      where: { username: req.body.username },
    });
    if (!student) {
      return res.status(404).send("Student not found");
    }
    // Check if student is actually a student
    if (student.role !== "student") {
      return res
        .status(403)
        .send(`Only allowed to add students to this course`);
    }

    const userId = student.id;
    const courseId = req.body.courseId;

    const enrollmentQuery = `
      INSERT INTO "enrollments" ("id", "user_id", "course_id")
      VALUES (DEFAULT, $1, $2)
      RETURNING "id", "user_id", "course_id"
    `;
    const enrollment = await Enrollment.sequelize?.query(enrollmentQuery, {
      bind: [userId, courseId],
      type: QueryTypes.INSERT,
    });

    const editedCourse = await getUpdatedCourse(course.id);
    if (!editedCourse) {
      return res.status(404).send("Course not found");
    }
    return res.json(editedCourse);
  } catch (error) {
    next(error);
  }
});

// To remove a student into the course
router.delete("/", tokenExtractor, async (req: CustomRequest, res, next) => {
  try {
    // Check if logged in user (aka the teacher) has permissions to add students
    const teacher = req.user;
    const course = await Course.findByPk(req.body.courseId);
    if (!teacher) {
      return res.status(401).send("User not logged in");
    }
    if (!course) {
      return res.status(404).send("Course not found");
    }
    if (teacher.id.toString() !== course.teacherId.toString()) {
      return res
        .status(403)
        .send(
          `You don't have permissions to delete students from this course.`
        );
    }

    // Check if student exists

    const student_id = req.body.studentId;

    const student = await User.findOne({
      where: { id: student_id },
    });
    if (!student) {
      return res.status(404).send("Student not found");
    }
    // Check if student is actually a student
    if (student.role !== "student") {
      return res
        .status(403)
        .send(`Only allowed to delete students to this course`);
    }

    const userId = student.id;
    const courseId = req.body.courseId;

    const deleteEnrollmentQuery = `
    DELETE FROM "enrollments"
    WHERE "user_id" = $1 AND "course_id" = $2
  `;
    await Enrollment.sequelize?.query(deleteEnrollmentQuery, {
      bind: [userId, courseId],
      type: QueryTypes.DELETE,
    });
    const editedCourse = await getUpdatedCourse(course.id);
    if (!editedCourse) {
      return res.status(404).send("Course not found");
    }
    return res.json(editedCourse);
  } catch (error) {
    next(error);
  }
});

export default router;
