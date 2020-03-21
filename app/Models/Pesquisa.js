'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pesquisa extends Model {

    static get hidden() {
        return ['updated_at', 'categoria_id']
    }

    items() {
        return this.hasMany('App/Models/Item')
    }

    categoria() {
        return this.belongsTo('App/Models/Categoria')
    }

    user() {
        return this.belongsTo('App/Models/User')
    }
}

module.exports = Pesquisa
