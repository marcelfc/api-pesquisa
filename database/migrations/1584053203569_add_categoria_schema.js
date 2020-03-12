'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCategoriaSchema extends Schema {
  up () {
    this.table('pesquisas', (table) => {
      table.integer('categoria_id').references('id').inTable('categorias')
      .onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  down () {
    this.table('pesquisas', (table) => {
      table.dropColumn('categoria_id')
    })
  }
}

module.exports = AddCategoriaSchema
