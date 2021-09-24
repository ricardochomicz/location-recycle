import { Router } from 'express'
import knex from '../database'

const locationsRouter = Router()

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