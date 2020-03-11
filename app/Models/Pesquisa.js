'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pesquisa extends Model {
    items(){
        return this.hasMany('App/Models/Item')
    }
}

module.exports = Pesquisa
