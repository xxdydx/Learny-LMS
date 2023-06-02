import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { ChapterType } from "../types";

class Course extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public teacherId!: number;
  public chapters!: ChapterType[];
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
    template: {
      type: DataTypes.BOOLEAN,
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
