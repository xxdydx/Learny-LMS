import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class File extends Model {}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fileLink: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "file",
  }
);

export default File;
