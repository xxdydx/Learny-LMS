const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("enrollment", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "courses", key: "id" },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("enrollment");
  },
};
