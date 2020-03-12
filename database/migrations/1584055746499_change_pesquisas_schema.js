'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangePesquisasSchema extends Schema {
  up () {
    this.table('pesquisas', (table) => {
      table.string('public_key', 255)
      table.boolean('is_public').defaultTo(true)
    })
  }

  down () {
    this.table('pesquisas', (table) => {
      table.dropColumn('public_key')
      table.dropColumn('is_public')
    })
  }
}

module.exports = ChangePesquisasSchema
