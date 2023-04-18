import { Model, DataTypes } from "sequelize";
import { CourseType } from "../types";
import { sequelize } from "../utils/db";
import { User } from "../models";

class Course extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },

  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "course",
  }
);

export default Course;
