import { Router } from 'express'
import knex from '../database'
import multer from 'multer'
import multerConfig from '../config/multer'
import { celebrate, Joi } from 'celebrate'
import isAuthenticated from '../middleware/isAuthenticated'

const locationsRouter = Router()

const upload = multer(multerConfig)

locationsRouter.use(isAuthenticated)

locationsRouter.get('/', async (req, res) => {
    const { city, state, items } = req.query
    const parsedItems: Number[] = String(items).split(',').map(item =>
        //remove espaços da string
        Number(item.trim())
    )
    const locations = await knex('locations')
        .select('locations.*')
        .join('location_items', 'locations.id', '=', 'location_items.location_id')
        .modify(function (queryBuilder) {
            if (items) {
                queryBuilder.whereIn('location_items.item_id', parsedItems)
            }
            if (city) {
                queryBuilder.where('city', String(city))
            }
            if (state) {
                queryBuilder.where('state', String(state))
            }
        })
        .distinct()
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


locationsRouter.post('/', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        state: Joi.string().required().max(2),
    })
},{
    abortEarly: false
}), async (req, res) => {
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

locationsRouter.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params

    const image = req.file?.filename

    const location = await knex('locations').where('id', id).first()

    if (!location) {
        return res.status(400).json({ message: 'Location not found!' })
    }

    //const locationUpdated = {...location, image}

    await knex('locations').update({ ...location, image }).where('id', id)

    return res.json({ message: 'Location updated success' })
})


export default locationsRouter