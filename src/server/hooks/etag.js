import path from 'path'

import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

import logger from '../../logger'

export default (app) => {
  logger.info('loading hook %s...', path.basename(__filename, '.js'))

  app.use(conditional())
  app.use(etag())
}
