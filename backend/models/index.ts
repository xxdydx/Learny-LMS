import Course from "./course";
import Chapter from "./chapter";
import Section from "./section";
import File from "./file";

Course.hasMany(Chapter);
Chapter.belongsTo(Course);

Chapter.hasMany(Section);
Section.belongsTo(Chapter);

Section.hasMany(File);
File.belongsTo(Section);
