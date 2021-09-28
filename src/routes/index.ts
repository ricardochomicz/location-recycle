import { Router } from 'express'
import sessionsRoutes from './auth/sessions.routes'
import { celebrate, Joi } from 'celebrate'
import multer from 'multer';
import multerConfig from '../config/multer';
import ItemController from '../controllers/itemController'
import LocationController from '../controllers/locationController'
import isAuthenticated from '../middleware/isAuthenticated';

const routes = Router()
const upload = multer(multerConfig);
const itemController = new ItemController()
const locationController = new LocationController()

routes.use('/sessions', sessionsRoutes)
routes.use(isAuthenticated)

routes.get('/items', itemController.index)

routes.get('/locations', locationController.index)
routes.get('/location/:id', locationController.show)
routes.post('/location', upload.single('image'),
    // celebrate({
    //     body: Joi.object().keys({
    //         name: Joi.string().required(),
    //         email: Joi.string().required().email(),
    //         whatsapp: Joi.number().required(),
    //         latitude: Joi.number().required(),
    //         longitude: Joi.number().required(),
    //         city: Joi.string().required(),
    //         state: Joi.string().required().max(2),
    //         items: Joi.array().items(Joi.string().required(), Joi.number().required())
    //     })
    // }, {
    //     abortEarly: false
    // }), 
    locationController.create)

//routes.use('/users', usersRoutes)



export default routes