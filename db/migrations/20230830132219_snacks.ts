import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable();
    table.text('description');
    table.boolean('is_inside_diet').notNullable();
    table.timestamp('meal_date').defaultTo(knex.fn.now()).notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks');
}
