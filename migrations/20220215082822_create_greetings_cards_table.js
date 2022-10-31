exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("greeting_cards", function (table) {
      table.increments("id").primary();
      table
        .integer("greeting_id")
        .unsigned()
        .references("id")
        .inTable("greetings")
        .onDelete("CASCADE");
      table.string("file_en");
      table.string("file_ar");
      table.integer("status").defaultTo(1);
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
  return Promise.all([knex.schema.dropTable("greeting_cards")]);
};
