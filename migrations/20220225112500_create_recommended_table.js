exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("recommended", function (table) {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("source");
      table.string("voucher_id");
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
  return Promise.all([knex.schema.dropTable("recommended")]);
};
