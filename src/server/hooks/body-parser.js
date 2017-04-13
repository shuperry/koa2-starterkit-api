import path from 'path'

import bodyParser from 'koa-bodyparser'

import logger from '../../logger'

export default (app) => {
  logger.info('loading hook %s...', path.basename(__filename, '.js'))

  app.use(bodyParser({
    onerror (err, ctx) {
      ctx.throw(`body parse with err = ${err}`, 422)
    }
  }))
}
