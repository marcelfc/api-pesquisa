'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Item extends Model {
    pesquisa(){
        return this.belongsTo('App/Models/Pesquisa')
    }
}

module.exports = Item
