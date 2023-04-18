const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn("courses", "teacherId", "teacher_id");
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn("courses", "teacher_id", "teacherId");
  },
};
