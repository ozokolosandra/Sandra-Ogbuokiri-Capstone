/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("user_name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("uplifting_messages", (table) => {
      table.increments("id").primary();
      table.string("mood_category", 50).notNullable().unique(); // Add unique constraint
      table.string("message", 1000).notNullable().collate("utf8mb4_unicode_ci");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    
    .createTable("mood", (table) => {
      table.increments("id").primary();
      table.string("mood_text", 1000).notNullable().collate("utf8mb4_unicode_ci");
      table
        .string("mood_category", 50)
        .notNullable()
        .references("mood_category")
        .inTable("uplifting_messages")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("reports", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("generated_at").defaultTo(knex.fn.now());
      table.json("report_data");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTableIfExists("reports")
    .dropTableIfExists("mood")
    .dropTableIfExists("uplifting_messages")
    .dropTableIfExists("users");
}
