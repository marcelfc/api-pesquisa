'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with pesquisas
 */

const Pesquisa = use('App/Models/Pesquisa')
const User = use('App/Models/User')
const Hash = use('Hash')
const Database = use('Database')

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
            response.status(500).send({ message: 'Erro ao buscar pesquisas.' })
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
            const data = request.only(['titulo', 'categoria_id', 'is_public', 'username', 'email'])
            const data_items = request.only(['items'])
            const date = new Date()
            date.setDate(date.getDate() + 7)

            const user = await User.findOrCreate(
                {email: data.email},
                {username: data.username, email: data.email, password: await Hash.make(this.generatePublicKey(20))})

            const pesquisa = await Pesquisa.create(
                {
                    titulo: data.titulo,
                    categoria_id: data.categoria_id,
                    is_public: data.is_public,
                    user_id: user.id,
                    data_expiracao: date.toISOString(),
                    public_key: this.generatePublicKey(20),
                })
            data_items['items'].map(item => {
                pesquisa.items().create({ descricao: item.descricao })
            })

            await pesquisa.loadMany(['items', 'categoria'])

            return pesquisa
        } catch (error) {
            console.log(error)
            response.status(500).send({ message: 'Erro ao salvar pesquisa.' })
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
            response.status(500).send({ message: 'Erro ao buscar pesquisa.' })
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
            response.status(200).send({ message: 'Pesquisa excluída com sucesso.' })
        } catch (error) {
            response.status(500).send({ message: 'Erro ao excluir pesquisa.' })
        }
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

    async lastFive({ params, request, response }) {
        try {
            const pesquisas = await Pesquisa.query()
            .where('is_public', true)
            .orderBy('created_at', 'desc')
            .with('items').with('categoria')
            .limit(5)
            .fetch()
            return pesquisas
        } catch (error) {
            console.log(error)
            response.status(500).send({ message: error })
        }
        
    }

    async topThree({params, request, response}) {
        try {
            const data = await Database.raw(`
                select p.id, sum(i.votos) as total from pesquisas as p
                join items as i on i.pesquisa_id = p.id
                where p.data_expiracao > 'NOW()'
                group by p.id
                order by total desc
                limit 3
            `)
            let results = []
            for(let d of data.rows){
                const pesquisa = await Pesquisa.findOrFail(d.id)
                await pesquisa.loadMany(['items', 'categoria'])
                results.push(pesquisa)
            }
            return results
        } catch (error) {
            console.log(error)
            response.status(500).send({ message: error })
        }
    }
}

module.exports = PesquisaController
