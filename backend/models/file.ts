import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class File extends Model {
  public id!: number;
  public name!: string;
  public link!: string;
  public awskey!: string;
  public sectionId!: number;
  public visibledate !: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    awskey: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visibledate: {
      type: DataTypes.DATE,
      allowNull: true,
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
