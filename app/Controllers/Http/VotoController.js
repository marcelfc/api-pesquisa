'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const User = use('App/Models/User')
const Item = use('App/Models/Item')
const Pesquisa = use('App/Models/Pesquisa')
const Hash = use('Hash')
/**
 * Resourceful controller for interacting with votos
 */
class VotoController {
    /**
     * Show a list of all votos.
     * GET votos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
    }

    /**
     * Render a form to be used for creating a new voto.
     * GET votos/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new voto.
     * POST votos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {
            const data = request.only(['pesquisa_id', 'item_id', 'username', 'email'])
            const user = await User.findOrCreate(
                { email: data.email },
                { username: data.username, email: data.email, password: await Hash.make(this.generatePublicKey(20)) })
            const item = await Item.findOrFail(data.item_id)
            await Item.query()
                .where('id', data.item_id)
                .update({ votos: item.votos + 1 })

            const pesquisa = await Pesquisa.findOrFail(data.pesquisa_id)
            await pesquisa.loadMany(['items', 'categoria'])
            return pesquisa

        } catch (error) {
            console.log(error)
            response.status(500).send({ message: 'Erro ao salvar voto.' })
        }
    }

    /**
     * Display a single voto.
     * GET votos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
    }

    /**
     * Render a form to update an existing voto.
     * GET votos/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update voto details.
     * PUT or PATCH votos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a voto with id.
     * DELETE votos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }

    generatePublicKey(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

module.exports = VotoController
