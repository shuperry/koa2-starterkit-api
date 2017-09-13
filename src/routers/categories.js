import _ from 'lodash'
import merge from 'lodash.merge'
import Router from 'koa-router'

import categoryService from '../services/category-service'

import routerUtil from '../utils/router-util'

const router = new Router()

router.get('/categories/', async (ctx, next) => {
  const params = merge(ctx.query, ctx.params)

  // deal with date type & undefined or null value params.
  routerUtil.dealSpecialParam(params)

  // check param types.
  const checkParamTypeMsg = routerUtil.checkParamType(params, [
    'code',
    {
      name: 'category_id',
      type: 'integer'
    },
    {
      name: 'parent_id',
      type: 'integer'
    },
    {
      name: 'level',
      type: 'integer'
    }
  ], [
    '编号',
    '通用类别id',
    '上级id',
    '等级'
  ])
  if (true !== checkParamTypeMsg) {
    ctx.body = {
      status: 400,
      error: checkParamTypeMsg
    }
    return
  }

  ctx.body = {
    result: await categoryService.getCategories({
      ctx,
      params
    }),
    error: null
  }

  await next()
})

router.post('/categories/', async (ctx, next) => {
  const params = merge(ctx.request.body, ctx.req.body)

  // deal with date type & undefined or null value params.
  routerUtil.dealSpecialParam(params)

  const result = await categoryService.createCategory({
    ctx,
    params
  })

  ctx.body = {
    result,
    error: null
  }

  await next()
})

router.get('/categories/:category_id', async (ctx, next) => {
  const params = ctx.params

  // deal with date type & undefined or null value params.
  routerUtil.dealSpecialParam(params)

  // check required param.
  const checkRequireParamMsg = routerUtil.checkRequireParam(params, ['category_id'], ['通用类别id'])
  if (true !== checkRequireParamMsg) {
    ctx.body = {
      status: 400,
      error: checkRequireParamMsg
    }
    return
  }

  // check param types.
  const checkParamTypeMsg = routerUtil.checkParamType(params, [
    {
      name: 'category_id',
      type: 'integer'
    }
  ], ['通用类别id'])
  if (true !== checkParamTypeMsg) {
    ctx.body = {
      status: 400,
      error: checkParamTypeMsg
    }
    return
  }

  const messages = {
    notExists: '通用类别不存在'
  }

  const result = await categoryService.getCategoryById({
    ctx,
    params
  })
  if (_.isPlainObject(result) && result.flag === false) {
    ctx.body = {
      status: (result.status_code || 400),
      error: (result.error_msg || messages[result.error_code])
    }
  } else {
    ctx.body = {
      result,
      error: null
    }
  }

  await next()
})

/**
 * router for update category.
 */
router.patch('/categories/:category_id', async (ctx, next) => {
  const params = merge(ctx.request.body, ctx.req.body, ctx.params)

  // deal with date type & undefined or null value params.
  routerUtil.dealSpecialParam(params)

  const messages = {
    notExists: '通用类别数据不存在'
  }

  const result = await categoryService.updateCategory({
    ctx,
    params
  })
  if (_.isPlainObject(result) && result.flag === false) {
    ctx.body = {
      status: (result.status_code || 400),
      error: (result.error_msg || messages[result.error_code])
    }
  } else {
    ctx.body = {
      result,
      error: null
    }
  }

  await next()
})

export default router
