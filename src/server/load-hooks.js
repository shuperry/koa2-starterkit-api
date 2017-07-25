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
  'history-api-fallback',
  // 'static-service'
]

export default async ({app}) => {
  hooks
    .map(hookName => path.resolve(__dirname, 'hooks', hookName))
    .map(fileName => require(fileName).default)
    .forEach(hook => hook(app))
}
