/**
 * Created by perry on 2017/6/9.
 */
import historyApiFallback from 'koa2-history-api-fallback'

export default (app) => {
  logger.info('loading hook %s...', path.basename(__filename, '.js'))

  app.use(historyApiFallback())
}
