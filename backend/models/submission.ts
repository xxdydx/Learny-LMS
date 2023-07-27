import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Submission extends Model {
  public id!: number;
  public name!: string;
  public link!: string;
  public awskey!: string;
  public assignmentId!: number;
}

Submission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    submittedLink: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    markedLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAwsKey: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    markedAwsKey: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    grade: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "submission",
  }
);

export default Submission;
