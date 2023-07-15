import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Recording extends Model {
  public id!: number;
  public title!: string;
  public share_url!: string;
  public teacherId!: number;
  public passcode!: number;
  public start_time!: number;
  public duration!: number;
}

Recording.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    share_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    passcode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "recording",
  }
);

export default Recording;
