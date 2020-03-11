'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PesquisaSchema extends Schema {
  up () {
    this.create('pesquisas', (table) => {
      table.increments()
      table.string('titulo', 255).notNullable()
      table.datetime('data_expiracao').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('pesquisas')
  }
}

module.exports = PesquisaSchema
