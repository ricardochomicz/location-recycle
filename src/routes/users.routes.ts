import { Router } from 'express'
import knex from '../database'
import { hash } from 'bcryptjs'

const usersRoutes = Router()

usersRoutes.get('/', async (req, res) => {
    const users = await knex('users').select('*')

    return res.json(users)
})

usersRoutes.post('/', async (req, res) => {
    const { name, email, password } = req.body

    const passwordHash = await hash(password, 8)

    const user = { name, email, password: passwordHash }

    const newId = await knex('users').insert(user)

    return res.json({
        id: newId[0],
        ...user
    })
})

export default usersRoutes