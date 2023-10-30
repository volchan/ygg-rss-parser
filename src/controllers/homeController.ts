import asyncHandler from 'express-async-handler'

import { ViewsPathBuilder } from '@utils/views'

const TITLE = 'HOME'
const viewsPathBuilder = new ViewsPathBuilder('home')

const index = asyncHandler(async (req, res) => {
  res.render(viewsPathBuilder.build('/index'), {
    title: TITLE,
    message: 'Ygg Rss Parser',
  })
})

export default { index }
