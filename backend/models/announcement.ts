import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Announcement extends Model {
  public id!: number;
  public title!: string;
  public message!: string;
  public expiry!: Date;
}

Announcement.init(
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "announcement",
  }
);

export default Announcement;
