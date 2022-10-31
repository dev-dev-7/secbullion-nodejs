exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("popular_products", function (table) {
      table.increments("id").primary();
      table.string("product_id").notNullable();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("popular_products")]);
};
