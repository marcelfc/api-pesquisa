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
        try {
            const pesquisas = await Pesquisa.query().with('items').with('categoria').fetch()
            return pesquisas  
        } catch (error) {
            response.status(500).send({message: 'Erro ao buscar pesquisas.'})
        }
        
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

        try {
            const data = request.only(['titulo', 'categoria_id'])
            const data_items = request.only(['items'])
            const date = new Date()
            date.setDate(date.getDate() + 7)
            const pesquisa = await Pesquisa.create({... data, data_expiracao: date.toISOString()})
            data_items['items'].map(item => {
                pesquisa.items().create({descricao: item.descricao})
            })
            
            await pesquisa.load('items', 'categoria')

            return pesquisa
        } catch (error) {
            response.status(500).send({message: 'Erro ao salvar pesquisa.'})
        }
        
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
        try {
            const pesquisa = await Pesquisa.findOrFail(params.id)
            await pesquisa.loadMany(['items', 'categoria'])
            return pesquisa
        } catch (error) {
            response.status(500).send({message: 'Erro ao buscar pesquisa.'})
        }
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
        try {
            const pesquisa = await Pesquisa.find(params.id)
            pesquisa.delete()
            response.status(200).send({message: 'Pesquisa excluída com sucesso.'})
        } catch (error) {
            response.status(500).send({message: 'Erro ao excluir pesquisa.'})
        }
    }
}

module.exports = PesquisaController
