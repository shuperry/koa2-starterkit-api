import convert from 'koa-convert'
import timeout from 'koa-timeout'

import config from '../../config'

export default (app) => {
  app.use(convert(timeout(config.get('requestMaxRespondTime'))))
}
