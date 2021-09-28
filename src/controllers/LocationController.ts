import { Request, Response } from 'express'
import knex from '../database'
import env from '../config/env'

class LocationController {

    async index(req: Request, res: Response) {
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
    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        const location = await knex('locations').where('id', id).first()

        if (!location) {
            return res.status(400).json({ message: 'Location not found!' })
        }

        const serializedLocation = {
            ...location,
            image: `${env.host}/uploads/${location.image}`
        }

        const items = await knex('items')
            .join('location_items', 'items.id', '=', 'location_items.item_id')
            .where('location_items.location_id', id)
            .select('items.id', 'items.title')


        return res.json({ location: serializedLocation, items })
    }

    async create(req: Request, res: Response) {
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

        const transaction = await knex.transaction();
    
        const newId = await transaction('locations').insert(location)

        console.log(location)
    
        const location_id = newId[0]
    
        const locationItems = items.map((item_id: number) => {
            return {
                item_id,
                location_id
            }
        })
            // .split(',')
            // .map((item: string) => Number(item.trim()))
            // .map((item_id: number) => {
            //     return {
            //         item_id,
            //         location_id,
            //     };
            // });
    
        await transaction('location_items').insert(locationItems)
    
        await transaction.commit()
    
        return res.json({
            id: location_id,
            ...location,
        })
    }
}

export default LocationController