import path from 'path'

import _ from 'lodash'
import isFunction from 'lodash.isfunction'
import values from 'lodash.values'
import fs from 'fs-plus'

import hierachy from 'sequelize-hierarchy'

import config from '../config'
import logger from '../logger'

const Sequelize = hierachy(require('sequelize'))

const sequelize = new Sequelize(
  config.get('db:database'),
  config.get('db:username'),
  config.get('db:password'),
  config.get('db:options')
)

const modelPath = path.join(__dirname, '..', 'models')

export default async (callback) => {
  fs.listTreeSync(modelPath)
    .reduce((prev, current) => prev.concat(current), [])
    .filter(filePath => fs.isFileSync(filePath) && path.extname(filePath) === '.js')
    .forEach(filePath => {
      logger.debug('importing model', filePath)
      sequelize.import(filePath)
    })

  values(sequelize.models)
    .filter(model => isFunction(model.associate))
    .forEach(model => model.associate(sequelize.models))

  // // rebuild hierarchy data for Object and Category model.
  // await sequelize.models.Object.rebuildHierarchy()
  // await sequelize.models.Category.rebuildHierarchy()

  // 初始化不存在的数据库表.
  await sequelize.sync()

  g_api.sequelize = sequelize
  g_api.models = sequelize.models

  if (_.isFunction(callback)) await callback()

  return sequelize
}
