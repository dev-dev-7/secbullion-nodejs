exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users_payment_details", function (table) {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("payment_type");
      table.string("payment_data");
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
  return Promise.all([knex.schema.dropTable("users_payment_details")]);
};
