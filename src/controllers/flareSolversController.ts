import asyncHandler from 'express-async-handler'

import { ViewsPathBuilder } from '@utils/views'

const TITLE = 'FLARE SOLVER'
const viewsPathBuilder = new ViewsPathBuilder('flareSolvers')

const index = asyncHandler(async (req, res) => {
  res.render(viewsPathBuilder.build('/index'), {
    title: TITLE,
    message: 'Flare Solvers',
  })
})

export default { index }
