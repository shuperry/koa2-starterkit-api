import {Pool} from 'generic-pool'
import Debug from 'debug'
import mysql from 'mysql'

import config from '../../config'

const debug = new Debug('mysql-pool')

export default (app) => {
  const mysqlPool = new Pool({
    name: 'mysql',
    create: cb => {
      const c = mysql.createConnection({
        user: config.get('db:username'),
        password: config.get('db:password'),
        database: config.get('db:database')
      })

      // parameter order: err, resource
      cb(null, c)
    },
    destroy: (client) => client.destroy(),
    max: config.get('db:options:pool:max'),
    // optional. if you set min > 0, make sure to drain() (see step 3)
    min: config.get('db:options:pool:min'),
    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis: 30000,
    // if true, logs via console.log - can also be a function
    log: true
  })

  app.use(async (ctx, next) => {
    await mysqlPool.acquire((err, client) => {
      if (err) ctx.throw('Fail to acquire one mysql connection')

      ctx.db = client
    })

    debug('Acquire one connection')

    try {
      await next()
    } catch (e) {
      throw e
    } finally {
      if (ctx.db) ctx.db.destroy()

      debug('Release one connection')
    }
  })
}
