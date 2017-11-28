import path from 'path'

import _ from 'lodash'
import isFunction from 'lodash.isfunction'
import values from 'lodash.values'
import cls from 'continuation-local-storage'
import fs from 'fs-plus'

import hierachy from 'sequelize-hierarchy'

import config from '../config'
import logger from '../logger'

const namespace = cls.createNamespace('g_api_cls')

const Sequelize = hierachy(require('sequelize'))
Sequelize.useCLS(namespace)

const dbOptions = config.get('db:options')

// const Op = Sequelize.Op
// dbOptions.operatorsAliases = {
//   $eq: Op.eq,
//   $ne: Op.ne,
//   $gte: Op.gte,
//   $gt: Op.gt,
//   $lte: Op.lte,
//   $lt: Op.lt,
//   $not: Op.not,
//   $in: Op.in,
//   $notIn: Op.notIn,
//   $is: Op.is,
//   $like: Op.like,
//   $notLike: Op.notLike,
//   $iLike: Op.iLike,
//   $notILike: Op.notILike,
//   $regexp: Op.regexp,
//   $notRegexp: Op.notRegexp,
//   $iRegexp: Op.iRegexp,
//   $notIRegexp: Op.notIRegexp,
//   $between: Op.between,
//   $notBetween: Op.notBetween,
//   $overlap: Op.overlap,
//   $contains: Op.contains,
//   $contained: Op.contained,
//   $adjacent: Op.adjacent,
//   $strictLeft: Op.strictLeft,
//   $strictRight: Op.strictRight,
//   $noExtendRight: Op.noExtendRight,
//   $noExtendLeft: Op.noExtendLeft,
//   $and: Op.and,
//   $or: Op.or,
//   $any: Op.any,
//   $all: Op.all,
//   $values: Op.values,
//   $col: Op.col
// }

const sequelize = new Sequelize(
  config.get('db:database'),
  config.get('db:username'),
  config.get('db:password'),
  dbOptions
)

const modelPath = path.join(__dirname, '..', 'models')

export default async (callback) => {
  let model

  fs.listTreeSync(modelPath)
    .reduce((prev, current) => prev.concat(current), [])
    .filter(filePath => fs.isFileSync(filePath) && path.extname(filePath) === '.js')
    .forEach(filePath => {
      logger.info(`loading model: ${filePath.substring(modelPath.length + 1, filePath.length - 3)}`)
      model = sequelize.import(filePath)
      sequelize.models[model.name] = model
    })

  values(sequelize.models)
    .filter(model => isFunction(model.associate))
    .forEach(model => model.associate(sequelize.models))

  // await sequelize.models.Category.rebuildHierarchy()

  // 初始化不存在的数据库表.
  await sequelize.sync()

  g_api.sequelize = sequelize
  g_api.models = sequelize.models
  g_api.cls = namespace

  if (_.isFunction(callback)) await callback()

  return sequelize
}
