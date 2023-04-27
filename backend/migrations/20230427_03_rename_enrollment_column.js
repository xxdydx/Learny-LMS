const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn("enrollments", "userId", "user_id");
    await queryInterface.renameColumn("enrollments", "courseId", "course_id");
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn("enrollments", "user_id", "userId");
    await queryInterface.renameColumn("enrollments", "course_id", "courseId");
  },
};
