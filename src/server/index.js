import Koa from 'koa'
import PrettyError from 'pretty-error'

import loadModels from './load-models'
import loadHooks from './load-hooks'
import cacheStaticData from './cache-static-data'

import config from '../config'
import logger, {appStartedLogger} from '../logger'

global.g_api = {}

const app = new Koa()

app.listen(config.get('port'), async (err) => {
  if (err) {
    const pretty = new PrettyError()
    logger.error(pretty.render(err))
    return
  }

  await loadModels()

  await loadHooks({app})

  appStartedLogger('http', config.get('name'), config.get('port'))

  await cacheStaticData()
})

export default app
