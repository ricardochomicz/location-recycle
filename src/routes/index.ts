import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
    return res.json({message: 'As rotas mudaram!!'})
})

export default routes