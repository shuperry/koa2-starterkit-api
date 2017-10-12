import conditional from 'koa-conditional-get'
import etag from 'koa-etag'

export default (app) => {
  app.use(conditional())
  app.use(etag())
}
