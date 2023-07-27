module.exports = {
  up: async ({ context: queryInterface }) => {
    // Drop the table
    await queryInterface.dropTable("assignments", { cascade: true });
    await queryInterface.dropTable("submissions");
  },

  down: async ({ context: queryInterface }) => {
    // Re-create the table
    await queryInterface.createTable("assignments");
    await queryInterface.createTable("submissions");
  },
};
