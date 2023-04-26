import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Section extends Model {
  public id!: number;
  public title!: string;
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
    timestamps: false,
    modelName: "section",
  }
);

export default Section;
