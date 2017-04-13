import _ from 'lodash'
import async from 'async'
import keys from 'lodash.keys'
import values from 'lodash.values'
import schedule from 'node-schedule'

import loadModels from '../load-models'

import {gokuaiApiExecutor} from '../../utils/interfaces/gokuai'

import logger from '../../logger'
import config from '../../config'

global.legal = {
  gokuaiAPIRecords: {},
  gokuaiApiExecutor
}

loadModels(async () => {
  schedule.scheduleJob(config.get('gokuai:execAPIScheduleJobRule'), async () => {
    const {models} = legal

    logger.info('exec gokuai api task started...')

    if (keys(legal.gokuaiAPIRecords).length === 0) {
      const gokuaiAPIRecords = await models.GokuaiAPIRecord.findAll({
        where: {
          // status 0 refers to gokuai-api-record has not been executed successfully.
          status: 0
        },
        include: [
          {
            model: models.File,
            as: 'file'
          }
        ],
        order: [
          [
            'created_at',
            'ASC'
          ]
        ]
      })

      gokuaiAPIRecords.forEach(gokuaiAPIRecord => {
        legal.gokuaiAPIRecords[gokuaiAPIRecord.record_id] = gokuaiAPIRecord
      })
    }

    if (keys(legal.gokuaiAPIRecords).length > 0) {
      const seriesJobs = []
      values(legal.gokuaiAPIRecords).forEach(gokuaiAPIRecord => {
        seriesJobs.push(async (callback) => {
          async.retry({
            times: config.get('gokuai:execAPIRetryTimes'),
            interval: config.get('gokuai:execAPIRetryInterval'),
            errorFilter: (err) => {
              return !!err
            }
          }, async (cb) => {
            let param = JSON.parse(gokuaiAPIRecord.param)

            // parse file instance to api executor.
            param['localFile'] = gokuaiAPIRecord.file

            const result = await legal.gokuaiApiExecutor[gokuaiAPIRecord.mark](param)
            if (result.statusCode === 200) { // HTTP_OK.
              // status 1 refers to gokuai-api-record has been executed successfully.
              await gokuaiAPIRecord.update({
                status: 1,
                updated_at: Number(new Date())
              }, {fields: gokuaiAPIRecord.attributes})

              // delete gokuai-api-record has been executed successfully.
              delete legal.gokuaiAPIRecords[gokuaiAPIRecord.record_id]

              cb(null)
            } else if (result === 'fileNotExists') {
              logger.error(
                `够快云盘API执行失败, 消息 id = ${gokuaiAPIRecord.record_id} method = ${gokuaiAPIRecord.mark} param = ${gokuaiAPIRecord.param} 磁盘文件不存在`)

              // status 0 refers to gokuai-api-record has not been executed successfully.
              await gokuaiAPIRecord.update({
                status: 0,
                failedTime: _.isNaN(Number(gokuaiAPIRecord.failedTime)) ? 1 : Number(gokuaiAPIRecord.failedTime) + 1,
                errorMsg: '磁盘文件不存在',
                updated_at: Number(new Date())
              }, {fields: gokuaiAPIRecord.attributes})

              cb('failed.')
            } else if (result === 'fileNotComplete') {
              logger.error(
                `够快云盘API执行失败, 消息 id = ${gokuaiAPIRecord.record_id} method = ${gokuaiAPIRecord.mark} param = ${gokuaiAPIRecord.param} 磁盘文件不完整`)

              // status 0 refers to gokuai-api-record has not been executed successfully.
              await gokuaiAPIRecord.update({
                status: 0,
                failedTime: _.isNaN(Number(gokuaiAPIRecord.failedTime)) ? 1 : Number(gokuaiAPIRecord.failedTime) + 1,
                errorMsg: '磁盘文件不完整',
                updated_at: Number(new Date())
              }, {fields: gokuaiAPIRecord.attributes})

              cb('failed.')
            } else {
              logger.error(
                `够快云盘API执行失败, 消息 id = ${gokuaiAPIRecord.record_id} method = ${gokuaiAPIRecord.mark} param = ${gokuaiAPIRecord.param} errorCode = ${result.body.error_code} errorMsg = ${result.body.error_msg}`)

              // status 0 refers to gokuai-api-record has not been executed successfully.
              await gokuaiAPIRecord.update({
                status: 0,
                failedTime: _.isNaN(Number(gokuaiAPIRecord.failedTime)) ? 1 : Number(gokuaiAPIRecord.failedTime) + 1,
                errorCode: result.body.error_code,
                errorMsg: result.body.error_msg,
                updated_at: Number(new Date())
              }, {fields: gokuaiAPIRecord.attributes})

              cb('failed.')
            }
          }, (err) => {
            // if gokuai-api-record has been executed failed finally, delete it either.
            if (!!err) {
              delete legal.gokuaiAPIRecords[gokuaiAPIRecord.record_id]
            }

            callback(null, gokuaiAPIRecord.record_id)
          })
        })
      })

      async.series(seriesJobs, (err, results) => {
      })
    }
  })
})
