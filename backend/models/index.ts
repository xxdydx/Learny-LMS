import Course from "./course";
import Chapter from "./chapter";
import Section from "./section";
import File from "./file";
import User from "./user";
import CourseStudent from "./coursestudent";

// for creator of course - e.g. Teacher
Course.belongsTo(User, { as: "teacher", foreignKey: "teacherId" });

// for mapping students to the course
Course.belongsToMany(User, { through: CourseStudent });
User.belongsToMany(Course, { through: CourseStudent });

// for the various sub-sections under each course
// Define association between Course and Chapter models
Course.hasMany(Chapter, {
  foreignKey: {
    name: "courseId",
    allowNull: false,
  },
});
Chapter.belongsTo(Course, {
  foreignKey: {
    name: "courseId",
    allowNull: false,
  },
});

Chapter.hasMany(Section, {
  foreignKey: {
    name: "chapterId",
    allowNull: false,
  },
});
Section.belongsTo(Chapter, {
  foreignKey: {
    name: "chapterId",
    allowNull: false,
  },
});

Section.hasMany(File);
File.belongsTo(Section);

export { default as Course } from "./course";
export { default as Chapter } from "./chapter";
export { default as Section } from "./section";
export { default as File } from "./file";
export { default as User } from "./user";
export { default as CourseStudent } from "./coursestudent";
