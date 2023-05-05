const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("enrollments", "user_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "user_id",
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    });
    await queryInterface.changeColumn("enrollments", "course_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "course_id",
      references: { model: "courses", key: "id" },
      onDelete: "CASCADE",
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("enrollments", "user_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: { model: "users", key: "id" },
    });
    await queryInterface.changeColumn("enrollments", "course_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "course_id",
      references: { model: "courses", key: "id" },
    });
  },
};
