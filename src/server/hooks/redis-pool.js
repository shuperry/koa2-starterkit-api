import path from 'path'

import convert from 'koa-convert'
import redisPool from 'koa-redis-pool'

import config from '../../config'
import logger from '../../logger'

export default (app) => {
  logger.info('loading hook %s...', path.basename(__filename, '.js'))

  app.use(convert(redisPool({
    host: config.get('redisServer:host'),
    port: config.get('redisServer:port'),
    family: config.get('redisServer:family_number'),
    db: config.get('redisServer:options:db'),
    password: config.get('redisServer:options:auth_pass')
  })))
}
