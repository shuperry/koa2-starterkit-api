import qs from 'koa-qs'

export default (app) => {
  qs(app, 'extended')
}
