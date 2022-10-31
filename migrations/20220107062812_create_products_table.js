exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("products", function (table) {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.enu("type", ["auction", "market"]);
      table
        .integer("category_id")
        .unsigned()
        .references("id")
        .inTable("products_categories")
        .onDelete("SET NULL");
      table.string("title_en");
      table.string("title_ar");
      table.text("description_en");
      table.text("description_ar");
      table.text("sales_info_en");
      table.text("sales_info_ar");
      table.text("properties");
      table.integer("quantity").unsigned();
      table.text("files");
      table.text("social_links");
      table.string("location");
      table.string("ip_address");
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
  return Promise.all([knex.schema.dropTable("products")]);
};
