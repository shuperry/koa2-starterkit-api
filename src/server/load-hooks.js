/**
 * Created by perry on 2017/6/9.
 */
import path from 'path'

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

const hookPath = path.join(__dirname, 'hooks')

export default async ({app}) => {
  hooks
    .map(hookName => path.join(hookPath, hookName))
    .map(filePath => {
      logger.info(`loading hook: ${path.basename(filePath)}`)
      return require(filePath).default
    })
    .forEach(hook => hook(app))
}
