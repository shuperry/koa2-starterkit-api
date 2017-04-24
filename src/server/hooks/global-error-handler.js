import path from 'path'

import onerror from 'koa-onerror'

import logger from '../../logger'

export default (app) => {
  logger.info('loading hook %s...', path.basename(__filename, '.js'))

  onerror(app, {
    all(err, ctx) {
      ctx.body = JSON.stringify({
        status: err.status || 500,
        error: err.message,
        stack: err.stack
      })
    }
  })
}
