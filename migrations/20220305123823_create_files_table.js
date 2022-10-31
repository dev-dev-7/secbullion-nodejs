exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("files", function (table) {
      table.increments("id").primary();
      table.string("url");
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("files")]);
};
