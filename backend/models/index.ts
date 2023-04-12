import Course from "./course";
import Chapter from "./chapter";
import Section from "./section";
import File from "./file";
import User from "./user";
import CourseStudent from "./coursestudent";

// for creator of course - e.g. Teacher
User.hasMany(Course);
Course.belongsTo(User, { as: "teacher" });

// for mapping students to the course
Course.belongsToMany(User, { through: CourseStudent });
User.belongsToMany(Course, { through: CourseStudent });

// for the various sub-sections under each course
Course.hasMany(Chapter);
Chapter.belongsTo(Course);

Chapter.hasMany(Section);
Section.belongsTo(Chapter);

Section.hasMany(File);
File.belongsTo(Section);
