import { Model, DataTypes } from "sequelize";

import { sequelize } from "../utils/db";

class Blacklistedtoken extends Model {
  public token!: string;
}

Blacklistedtoken.init(
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blacklistedtoken",
  }
);

export default Blacklistedtoken;
