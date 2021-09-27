import { Router } from 'express'
import knex from '../../database'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import auth from '../../config/auth'

const sessionsRoutes = Router()

sessionsRoutes.post('/', async (req, res) => {
    const { email, password } = req.body

    const user = await knex('users').where('email', email).first()

    if (!user) {
        return res.status(400).json({ message: 'Credentials not found!' })
    }

    const comparePassword = await compare(password, user.password)

    if (!comparePassword) {
        return res.status(400).json({ message: 'Credentials not found!' })
    }

    const token = sign({}, auth.jwt.secret, {
        subject: String(user.id),
        expiresIn: auth.jwt.expiresIn
    })

    return res.json({ user: { id: user.id, name: user.name }, token })

})

export default sessionsRoutes