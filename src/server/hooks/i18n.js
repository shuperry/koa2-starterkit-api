import path from 'path'

import merge from 'lodash.merge'

import locale from 'koa-locale'
import i18n from 'koa-i18n'

import config from '../../config'

export default (app) => {
  const options = {
    directory: path.join(__dirname, '..', '..', 'locales')
  }

  locale(app)
  app.use(i18n(app, merge({}, options, config.get('hooks:i18n'))))
}
