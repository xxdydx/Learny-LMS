import Course from "./course";
import Chapter from "./chapter";
import Section from "./section";
import File from "./file";
import User from "./user";
import Enrollment from "./enrollment";
import Recording from "./recording";
import Assignment from "./assignment";
import Submission from "./submission";
import Session from "./session";
import Announcement from "./announcement";

// for creator of course - e.g. Teacher
Course.belongsTo(User, { as: "teacher", foreignKey: "teacherId" });
Recording.belongsTo(User, { as: "teacher", foreignKey: "teacherId" });

Course.hasMany(Announcement, {
  foreignKey: {
    name: "courseId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Announcement.belongsTo(Course, {
  foreignKey: {
    name: "courseId",
    allowNull: false,
  },
  onDelete: "SET NULL",
});

// for mapping students to the course
Course.belongsToMany(User, {
  as: "students",
  through: Enrollment,
  foreignKey: "courseId",
});
User.belongsToMany(Course, {
  as: "courses",
  through: Enrollment,
  foreignKey: "userId",
});
// for the various sub-sections under each course
// Define association between Course and Chapter models
Course.hasMany(Chapter, {
  foreignKey: {
    name: "courseId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Chapter.belongsTo(Course, {
  foreignKey: {
    name: "courseId",
    allowNull: false,
  },
  onDelete: "SET NULL",
});

Chapter.hasMany(Section, {
  foreignKey: {
    name: "chapterId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Section.belongsTo(Chapter, {
  foreignKey: {
    name: "chapterId",
    allowNull: false,
  },
  onDelete: "SET NULL",
});

Section.hasMany(File, {
  foreignKey: {
    name: "sectionId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
File.belongsTo(Section, {
  foreignKey: {
    name: "sectionId",
    allowNull: false,
  },
  onDelete: "SET NULL",
});

Section.hasMany(Assignment, {
  foreignKey: {
    name: "sectionId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Assignment.belongsTo(Section, {
  foreignKey: {
    name: "sectionId",
    allowNull: false,
  },
  onDelete: "SET NULL",
});

Assignment.hasMany(Submission, {
  foreignKey: {
    name: "assignmentId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Submission.belongsTo(Assignment, {
  foreignKey: {
    name: "assignmentId",
    allowNull: false,
  },
  onDelete: "SET NULL",
});

Submission.belongsTo(User, { as: "student", foreignKey: "studentId" });

export { default as Course } from "./course";
export { default as Chapter } from "./chapter";
export { default as Section } from "./section";
export { default as File } from "./file";
export { default as User } from "./user";
export { default as Enrollment } from "./enrollment";
export { default as Assignment } from "./assignment";
export { default as Submission } from "./submission";
export { default as Recording } from "./recording";
export { default as Session } from "./session";
export { default as Announcement } from "./announcement";
