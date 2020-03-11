'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemSchema extends Schema {
  up () {
    this.create('items', (table) => {
      table.increments()
      table.string('descricao', 255).notNullable()
      table.integer('pesquisa_id').references('id').inTable('pesquisas')
      .onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('votos').notNullable().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }
}

module.exports = ItemSchema
