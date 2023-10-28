import express, { Request, Response } from 'express'

const HomeRouter = express.Router()

HomeRouter.get('/', function (req: Request, res: Response) {
  res.send('Ygg Rss Parser')
})

export default HomeRouter
