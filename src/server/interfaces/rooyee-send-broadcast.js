import _ from 'lodash'
import async from 'async'
import keys from 'lodash.keys'
import values from 'lodash.values'
import schedule from 'node-schedule'

import loadModels from '../load-models'

import {rooyeeApiExecutor} from '../../utils/interfaces/rooyee'

import logger from '../../logger'
import config from '../../config'

global.legal = {
  broadcasts: {},
  rooyeeApiExecutor
}

loadModels(() => {
  schedule.scheduleJob(config.get('rooyee:sendBroadCastScheduleJobRule'), async () => {
    const {models} = legal

    logger.info('sending broadcast task started...')

    if (keys(legal.broadcasts).length === 0) {
      const broadcasts = await models.Broadcast.findAll({
        where: {
          // status 0 refers to broadcast has not been sent successfully.
          status: 0
        },
        include: [
          {
            model: models.BroadcastPictureMsg,
            as: 'pic_msg'
          },
          {
            model: models.BroadcastNewsGroupsMsg,
            as: 'group_msgs'
          }
        ],
        order: [
          [
            'created_at',
            'ASC'
          ]
        ]
      })

      broadcasts.forEach(broadcast => {
        legal.broadcasts[broadcast.broadcast_id] = broadcast
      })
    }

    if (keys(legal.broadcasts).length > 0) {
      const seriesJobs = []
      values(legal.broadcasts).forEach((broadcast) => {
        seriesJobs.push(async (callback) => {
          async.retry({
            times: config.get('rooyee:sendBroadCastRetryTimes'),
            interval: config.get('rooyee:sendBroadCastRetryInterval'),
            errorFilter: (err) => {
              return !!err
            }
          }, async (cb) => {
            if ('picture' === broadcast.msgType) {
              const result = await legal.rooyeeApiExecutor.sendPictureBroadcast({
                user: broadcast.user,
                toUser: broadcast.toUser,
                title: broadcast.pic_msg.title,
                hyperlink: broadcast.pic_msg.hyperlink
              })
              if (result.flag) { // send successful.
                // status 1 refers to broadcast has been sent successfully.
                await broadcast.update({
                  status: 1,
                  updated_at: Number(new Date())
                }, {fields: broadcast.attributes})

                // delete broadcast has been sent successfully.
                delete legal.broadcasts[broadcast.broadcast_id]

                cb(null)
              } else { // send failed.
                logger.error(
                  `消息发送失败, 消息 id = ${broadcast.broadcast_id} title = ${broadcast.pic_msg.title} hyperlink = ${broadcast.pic_msg.hyperlink} errorCode = ${result.errorCode} errorMsg = ${result.errorMsg}`)

                // status 0 refers to broadcast has not been sent successfully.
                await broadcast.update({
                  status: 0,
                  failedTime: _.isNaN(Number(broadcast.failedTime)) ? 1 : Number(broadcast.failedTime) + 1,
                  errorCode: result.errorCode,
                  errorMsg: result.errorMsg,
                  updated_at: Number(new Date())
                }, {fields: broadcast.attributes})

                cb('failed.')
              }
            }
          }, (err) => {
            // if broadcast has been sent failed finally, delete it either.
            if (err) delete legal.broadcasts[broadcast.broadcast_id]

            callback(null, broadcast.broadcast_id)
          })
        })
      })

      async.series(seriesJobs, (err, results) => {
      })
    }
  })
})
