import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";
import Section from "./section";

class Chapter extends Model {
  public id!: number;
  public title!: string;
  public pinned!: boolean;
  public courseId!: number;
  public sections!: Section[];
}

Chapter.init(
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
    pinned: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "chapter",
  }
);

export default Chapter;
