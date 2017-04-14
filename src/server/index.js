import path from 'path'

import Koa from 'koa'
import PrettyError from 'pretty-error'

import logger, {appStartedLogger} from '../logger'

import config from '../config'

import cacheStaticData from './cache-static-data'

global.legal = {}

// load models.
import loadModels from './load-models'

const app = new Koa()

const hooks = [
  'cors',
  'global-error-handler',
  'i18n',
  'body-parser',
  'etag',
  'redis-pool',
  // 'mysql-pool',
  'querystring',
  // 'timeout',
  'router'
]

hooks
  .map(hookName => path.resolve(__dirname, 'hooks', hookName))
  .map(fileName => require(fileName).default)
  .forEach(hook => hook(app))

app.listen(config.get('port'), async (err) => {
  if (err) {
    const pretty = new PrettyError()
    logger.error(pretty.render(err))
    return
  }

  // load models.
  await loadModels()

  // cache static data after server started.
  await cacheStaticData()

  appStartedLogger('http', config.get('name'), config.get('port'))
})

export default app
