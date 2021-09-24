import { Knex } from 'knex'

export async function up(knex: Knex) {
    return knex.schema.createTable('location_items', table => {
        table.increments('id').primary
        table.integer('location_id')
            .references('id')
            .inTable('locations')
            .notNullable()
        table.integer('item_id')
            .references('id')
            .inTable('items')
            .notNullable()
    })
}

export async function down(knex:Knex) {
    return knex.schema.dropTable('location_items')
}