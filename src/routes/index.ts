import express from 'express'

import HomeRouter from './homeRouter'
import FlareSolverRouter from './flareSolverRouter'

const AppRouter = express.Router()

AppRouter.use(HomeRouter)
AppRouter.use('/flare_solver', FlareSolverRouter)

export default AppRouter
