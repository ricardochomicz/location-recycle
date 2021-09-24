import { Router } from 'express'
import itemsRouter from './items.routes'
import locationsRouter from './locations.routes'

const routes = Router()

routes.use('/items', itemsRouter)

routes.use('/location', locationsRouter)

export default routes