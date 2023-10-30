import express from 'express'

import homeController from '@controllers/homeController'

const HomeRouter = express.Router()

HomeRouter.get('/', homeController.index)
HomeRouter.get('/health', homeController.health)

export default HomeRouter
