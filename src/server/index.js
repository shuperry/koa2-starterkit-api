import path from 'path'

import Koa from 'koa'
import PrettyError from 'pretty-error'

import logger, {appStartedLogger} from '../logger'

import config from '../config'

import cacheStaticData from './cache-static-data'

import loadModels from './load-models'

global.g_api = {}

const app = new Koa()

const hooks = [
  // 'response-time',
  // 'helmet',
  'cors',
  'global-error-handler',
  'body-parser',
  'querystring',
  'etag',
  'redis-pool',
  // 'mysql-pool',
  // 'timeout',
  'i18n',
  'router',
  // 'static-service'
]

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

  hooks
    .map(hookName => path.resolve(__dirname, 'hooks', hookName))
    .map(fileName => require(fileName).default)
    .forEach(hook => hook(app))

  appStartedLogger('http', config.get('name'), config.get('port'))
})

export default app
