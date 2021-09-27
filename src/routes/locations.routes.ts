import { Router } from 'express'
import knex from '../database'

const locationsRouter = Router()

locationsRouter.get('/', async (req, res) => {
    const { city, state, items } = req.query

    const parsedItems = <any>String(items).split(',').map(item => 
        //remove espaços da string
        Number(item.trim())
    )

    const locations = await knex('locations')
        .join('location_items', 'locations.id', '=', 'location_items.location_id')
        .whereIn('location_items.item_id', parsedItems)
        .where('city', String(city))
        .where('state', String(state))
        .distinct()
        .select('locations.*')

    return res.json(locations)
})


locationsRouter.get('/:id', async (req, res) => {
    //recupera id como parametro
    const { id } = req.params
    //localiza no bd o registro
    const location = await knex('locations').where('id', id).first()

    if (!location) {
        //se não existir o id dispara mensagem de erro
        return res.status(400).json({ message: 'Location not found!' })
    }

    //faz o join entre as tabelas para trazer os items relacionados ao location
    const items = await knex('items')
        .join('location_items', 'items.id', '=', 'location_items.item_id')
        .where('location_items.location_id', id)
        .select('items.title')

    return res.json({
        location,
        items
    })
})


locationsRouter.post('/', async (req, res) => {
    const {
        name,
        image,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state,
        items
    } = req.body

    const location = {
        image: "fake.png",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state,
    }

    const newId = await knex('locations').insert(location)

    const locationId = newId[0]

    const locationItems = items.map((item_id: number) => {
        return {
            item_id,
            location_id: locationId
        }
    })

    await knex('location_items').insert(locationItems)

    return res.json({
        message: 'Location Create'
    })
})


export default locationsRouter