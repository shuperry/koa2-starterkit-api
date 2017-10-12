import bodyParser from 'koa-bodyparser'

import logger from '../../logger'

export default (app) => {
  app.use(bodyParser({
    onerror (err, ctx) {
      ctx.throw(`body parse with err = ${err}`, 422)
    }
  }))
}
