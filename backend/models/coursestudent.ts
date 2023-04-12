import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class CourseStudent extends Model {}

CourseStudent.init(
  {},
  {
    sequelize,
    modelName: "courseStudent",
  }
);

export default CourseStudent;
