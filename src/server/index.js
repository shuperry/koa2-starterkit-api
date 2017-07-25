import Koa from 'koa'
import PrettyError from 'pretty-error'

import logger, {appStartedLogger} from '../logger'

import config from '../config'

import cacheStaticData from './cache-static-data'

import loadModels from './load-models'

import loadHooks from './load-hooks'

global.g_api = {}

const app = new Koa()

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

  await loadHooks({app})

  appStartedLogger('http', config.get('name'), config.get('port'))
})

export default app
