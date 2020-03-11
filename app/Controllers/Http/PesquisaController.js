'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with pesquisas
 */

const Pesquisa = use('App/Models/Pesquisa')

class PesquisaController {
    /**
     * Show a list of all pesquisas.
     * GET pesquisas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        const pesquisas = await Pesquisa.all()
        return pesquisas
    }

    /**
     * Create/save a new pesquisa.
     * POST pesquisas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        const data = request.only(['titulo'])
        const data_items = request.only(['items'])
        const date = new Date()
        date.setDate(date.getDate() + 7)
        const pesquisa = await Pesquisa.create({... data, data_expiracao: date.toISOString()})
        data_items['items'].map(item => {
            console.log('aqui')
            pesquisa.items().create({descricao: item.descricao})
        })
        
        await pesquisa.load('items')

        return pesquisa
    }

    /**
     * Display a single pesquisa.
     * GET pesquisas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        const pesquisa = await Pesquisa.find(params.id)
        await pesquisa.load('items')
        return pesquisa
    }

    /**
     * Update pesquisa details.
     * PUT or PATCH pesquisas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a pesquisa with id.
     * DELETE pesquisas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = PesquisaController
