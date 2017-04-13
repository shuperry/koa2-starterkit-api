import path from 'path'

import qs from 'koa-qs'

import logger from '../../logger'

export default (app) => {
  logger.info('loading hook %s...', path.basename(__filename, '.js'))

  qs(app, 'extended')
}
