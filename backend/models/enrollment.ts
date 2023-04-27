import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Enrollment extends Model {}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: { model: "users", key: "id" },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "course_id",
      references: { model: "courses", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "enrollment",
    timestamps: false,
  }
);

export default Enrollment;
