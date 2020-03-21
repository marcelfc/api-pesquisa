'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUserPesquisaSchema extends Schema {
  up () {
    this.table('pesquisas', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
    })
  }

  down () {
    this.table('pesquisas', (table) => {
      table.dropColumn('user_id')
    })
  }
}

module.exports = AddUserPesquisaSchema
