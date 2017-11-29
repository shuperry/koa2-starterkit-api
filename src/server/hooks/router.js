/* eslint-disable global-require, no-param-reassign */

import path from 'path'

import _ from 'lodash'
import merge from 'lodash.merge'
import fs from 'fs-plus'
import jwt from 'jsonwebtoken'
import Router from 'koa-router'
import moment from 'moment'

import Promise from 'bluebird'

import config from '../../config'
import logger from '../../logger'

Promise.promisifyAll(jwt)

export default (app) => {
  const router = new Router({prefix: config.get('prefix')})
  const routerRootPath = path.join(__dirname, '..', '..', 'routers/')

  let beginVisitTime, finishVisitTime

  router.use(async (ctx, next) => {
    const url = ctx.url

    beginVisitTime = moment(moment(), 'YYYY-MM-DD HH:mm:ss SSS')
    if ('GET' === ctx.request.method) {
      logger.info('begin visiting url at', beginVisitTime.format('YYYY-MM-DD HH:mm:ss SSS'), ' =>', '[',
        ctx.request.method, ']', url.lastIndexOf('?') ===
        -1 ? url
          : url.substring(0, url.lastIndexOf('?')), 'with data =>', JSON.stringify(ctx.query),
        '\n header.authorization =>', ctx.header.authorization)
    } else if (_.includes([
        'POST',
        'PUT',
        'PATCH'
      ], ctx.request.method)) {
      let params = merge({}, ctx.request.body, ctx.req.body, ctx.params, ctx.query)

      logger.info('begin visiting url at', beginVisitTime.format('YYYY-MM-DD HH:mm:ss SSS'), ' =>', '[',
        ctx.request.method, ']', url, 'with data =>', params, '\n header.authorization =>', ctx.header.authorization)
    }

    ctx.type = 'json'
    await next()
  })

  // catch Invalid token UnauthorizedError.
  router.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      if (401 === err.status) {
        const url = ctx.url

        if ('GET' === ctx.request.method) {
          logger.info('catched Invalid token UnauthorizedError during visiting url =>', '[', ctx.request.method, ']',
            url.lastIndexOf('?') ===
            -1 ? url : url.substring(0, url.lastIndexOf('?')), 'with data =>', ctx.query)
        } else {
          logger.info('catched Invalid token UnauthorizedError during visiting url =>', '[', ctx.request.method, ']',
            url, 'with data =>', JSON.stringify(ctx.request.body))
        }

        ctx.body = {
          status: 401,
          error: '未登录或登录已失效, 请重新登录'
        }
      } else {
        throw err
      }
    }
  })

  // check authority.
  router.use(async (ctx, next) => {
    // passUrls in config pass check authority.
    if (_.includes(config.get('auth:passUrls'), ctx.url)) {
      if (!!ctx.header.authorization && ctx.header.authorization !== 'undefined' &&
        ctx.header.authorization !== 'null') {
        let user
        try {
          user = await jwt.verifyAsync(ctx.header.authorization, config.get('auth:jwt:secretKey'), {
            passthrough: true,
            ...(config.get('auth:jwt:options'))
          })
          ctx.state['user'] = user
        } catch (e) {
          return ctx.throw(401, 'Invalid token...')
        }

        logger.info('current logged in user =', {
          sid: user.sid,
          display_name: user.display_name,
          email: user.email
        })

        return await next()
      } else {
        return ctx.throw(401, 'Invalid token...')
      }

      // return await jwt({secret: config.get('auth:jwt:secretKey'), cookie: config.get('auth:cookie:token'), passthrough: true})(ctx, next)
    } else {
      // only urls in config file need check authority.
      const matchedAuthUrls = []
      config.get('auth:urls')
        .filter(urlPath => new RegExp(`^${urlPath}.*`).test(ctx.url))
        .forEach(urlPath => matchedAuthUrls.push(urlPath))

      if (matchedAuthUrls.length > 0) {
        if (!!ctx.header.authorization && ctx.header.authorization !== 'undefined' &&
          ctx.header.authorization !== 'null') {
          let user
          try {
            user = await jwt.verifyAsync(ctx.header.authorization, config.get('auth:jwt:secretKey'), config.get('auth:jwt:options'))
            ctx.state['user'] = user
          } catch (e) {
            return ctx.throw(401, 'Invalid token...')
          }

          logger.info('current logged in user =', {
            sid: user.sid,
            display_name: user.display_name,
            email: user.email
          })

          return await next()
        } else {
          return ctx.throw(401, 'Invalid token...')
        }

        // return await jwt({secret: config.get('auth:jwt:secretKey'), cookie: config.get('auth:cookie:token')})(ctx, next)
      } else { // if urls not in urls and passUrls, but has authorization in header, we check authority and passthrough.
        if (!!ctx.header.authorization && ctx.header.authorization !== 'undefined' &&
          ctx.header.authorization !== 'null') {
          let user
          try {
            user = await jwt.verifyAsync(ctx.header.authorization, config.get('auth:jwt:secretKey'), {
              passthrough: true,
              ...(config.get('auth:jwt:options'))
            })
            ctx.state['user'] = user
          } catch (e) {
            return ctx.throw(401, 'Invalid token...')
          }

          logger.info('current logged in user =', {
            sid: user.sid,
            display_name: user.display_name,
            email: user.email
          })
        }

        return await next()
      }
    }
  })

  // set utils user params in request with method type is not get.
  router.use(async (ctx, next) => {
    if (!!ctx.state.user) {
      if ('POST' === ctx.request.method) {
        ctx.request.body = _.extend({}, ctx.request.body, {
          created_by: ctx.state.user.user_id,
          updated_by: ctx.state.user.user_id,
          operated_by: ctx.state.user.user_id
        })
      } else if ('PATCH' === ctx.request.method) {
        ctx.request.body = _.extend({}, ctx.request.body, {
          updated_by: ctx.state.user.user_id,
          operated_by: ctx.state.user.user_id
        })
      } else if ('DELETE' === ctx.request.method) {
        ctx.request.body = _.extend({}, ctx.request.body, {
          updated_by: ctx.state.user.user_id,
          operated_by: ctx.state.user.user_id
        })
      }
    }

    await next()
  })

  fs
    .listTreeSync(routerRootPath)
    .filter(filePath => fs.isFileSync(filePath) && path.extname(filePath) === '.js')
    .map(name => name.substring(routerRootPath.length, name.length - 3)) // 3 is ext string '.js'.length.
    .forEach(name => {
      logger.info(`mounting router: /${name}`)
      router.use('', require(`${routerRootPath}/${name}`).default.routes())
    })

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.use(async (ctx, next) => {
    const url = ctx.url
    finishVisitTime = moment(moment(), 'YYYY-MM-DD HH:mm:ss SSS')

    if ('GET' === ctx.request.method) {
      logger.info('finish visiting url at', finishVisitTime.format('YYYY-MM-DD HH:mm:ss SSS'), 'taking time',
        (finishVisitTime -
        beginVisitTime), 'ms =>', '[', ctx.request.method, ']', url.lastIndexOf('?') ===
        -1 ? url : url.substring(0, url.lastIndexOf('?')))
    } else {
      logger.info('finish visiting url at', finishVisitTime.format('YYYY-MM-DD HH:mm:ss SSS'), 'taking time',
        (finishVisitTime -
        beginVisitTime), 'ms =>', '[', ctx.request.method, ']', url)
    }

    await next()
  })
}
