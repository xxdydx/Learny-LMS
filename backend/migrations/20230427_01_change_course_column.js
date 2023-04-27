const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("chapters", "course_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "courses",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("chapters", "course_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "courses",
        key: "id",
      },
    });
  },
};
