exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users", function (table) {
      table.increments("id").primary();
      table.string("email");
      table.string("mobile");
      table.string("password");
      table.bool("otp_verified").defaultTo(false);
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
  return Promise.all([knex.schema.dropTable("users")]);
};