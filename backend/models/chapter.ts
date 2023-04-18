import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Chapter extends Model {}

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
    timestamps: false,
    modelName: "chapter",
  }
);

export default Chapter;
