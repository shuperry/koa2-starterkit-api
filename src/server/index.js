import _ from 'lodash'
import Koa from 'koa'
import PrettyError from 'pretty-error'

import hotRestart from './hot-restart'
import loadModels from './load-models'
import loadHooks from './load-hooks'
import cacheStaticData from './cache-static-data'

import config from '../config'
import logger, {appStartedLogger} from '../logger'

global.g_api = {}

const env = config.get('environment')

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

  if (_.includes(config.get('split_single_conf_file:watch_envs'), env)) await hotRestart()
})

export default app
