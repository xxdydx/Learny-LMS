import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Chapter extends Model {
  public id!: number;
  public title!: string;
  public courseId!: number;
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "chapter",
  }
);

export default Chapter;
