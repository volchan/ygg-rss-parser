import express from 'express'

import homeController from '@controllers/homeController'

const HomeRouter = express.Router()

HomeRouter.get('/', homeController.index)

export default HomeRouter
