import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../utils/db";

class Session extends Model {
  public id!: number;
  public username!: string;
  public loginTime!: Date;
  public logoutTime!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    login_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    logout_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "sessions",
    sequelize,
    timestamps: false,
  }
);

export default Session;
