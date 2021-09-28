import {Request, Response} from 'express'
import knex from '../database'
import env from '../config/env'

class ItemController {

    async index(req:Request, res: Response){
        const items = await knex('items').select('*')
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image: `${env.host}/uploads/${item.image}`
            }
        })
        return res.json(serializedItems)
    }
}

export default ItemController