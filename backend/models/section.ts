import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";
import File from "./file";
import Assignment from "./assignment";

class Section extends Model {
  public id!: number;
  public title!: string;
  public chapterId!: number;
  public files !: File[];
  public assignments!: Assignment[];
}

Section.init(
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "section",
  }
);

export default Section;
