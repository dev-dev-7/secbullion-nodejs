exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("banners", function (table) {
      table.increments("id").primary();
      table.string("title_en");
      table.string("title_ar");
      table.text("description_en");
      table.text("description_ar");
      table.string("file");
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
  return Promise.all([knex.schema.dropTable("banners")]);
};
