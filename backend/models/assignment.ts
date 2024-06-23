import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Assignment extends Model {
  public id!: number;
  public name!: string;
  public link!: string;
  public awskey!: string;
  public sectionId!: number;
  public marks!: number;
  public deadline!: string;
  public instructions!: string;
}

Assignment.init(
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
      allowNull: false,
    },
    visibledate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "assignment",
  }
);

export default Assignment;
