import path from 'path'

import convert from 'koa-convert'
import timeout from 'koa-timeout'

import config from '../../config'
import logger from '../../logger'

export default (app) => {
  logger.info('loading hook %s...', path.basename(__filename, '.js'))

  app.use(convert(timeout(config.get('requestMaxRespondTime'))))
}
