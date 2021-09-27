import { Router } from 'express'
import sessionsRoutes from './auth/sessions.routes'
import itemsRouter from './items.routes'
import locationsRouter from './locations.routes'
import usersRoutes from './users.routes'

const routes = Router()

routes.use('/items', itemsRouter)

routes.use('/location', locationsRouter)

routes.use('/users', usersRoutes)

routes.use('/sessions', sessionsRoutes)

export default routes