import path from 'path'

import convert from 'koa-convert'
import cors from 'koa-cors'

import logger from '../../logger'

export default (app) => {
  logger.info('loading hook %s...', path.basename(__filename, '.js'))

  app.use(convert(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  })))
}
