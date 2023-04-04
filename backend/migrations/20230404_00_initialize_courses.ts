import { DataTypes } from "sequelize";
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("courses", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      teacher: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
  },
};
