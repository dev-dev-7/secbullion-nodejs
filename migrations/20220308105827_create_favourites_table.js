exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("favourites", function (table) {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table.integer("product_id").unsigned();
      // .references("id")
      // .inTable("products")
      // .onDelete("CASCADE");
      table.string("url");
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("favourites")]);
};
