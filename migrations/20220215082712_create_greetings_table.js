exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("greetings", function (table) {
      table.increments("id").primary();
      table.string("name_en");
      table.string("name_ar");
      table.integer("status").unsigned().notNullable();
      table
        .dateTime("created_at")
        .notNullable()
        .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      table
        .dateTime("updated_at")
        .notNullable()
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("greetings")]);
};
