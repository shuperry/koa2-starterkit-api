import fs from 'fs'
import path from 'path'

import keys from 'lodash.keys'
import values from 'lodash.values'
import fsPlus from 'fs-plus'
import _ from 'lodash'
import S from 'string'
import async from 'async'
import moment from 'moment'
import isTimestamp from 'validate.io-timestamp'
import isJSON from 'validate.io-json'
import json2csv from 'json2csv'
import diff from 'deep-diff'

import base64Img from 'base64-img'

import Promise from 'bluebird'
import request from 'request'
import download from 'download'

import config from '../config'
import logger from '../logger'

import createRedisClient from './redis-client'
import MailUtil from '../utils/mail-util'
import RedisUtil from '../utils/redis-util'

import { time } from 'core-decorators'
import {decorateArmour} from '../decorators/service-decorator'

import categoryHelper from '../helpers/category-helper'

import StoreGlobalDataUtil from './store-global-data'

Promise.promisifyAll(async)
Promise.promisifyAll(request)

const testSth = async (client) => {
  const {models} = g_api

  // const parent_1 = await models.Category.create({
  //   name: '性别',
  //   code: 'gender',
  //   rank: 1
  // })
  // await models.Category.create({
  //   name: '男',
  //   code: 'gender_male',
  //   rank: 1,
  //   parent_id: parent_1.category_id
  // })
  // await models.Category.create({
  //   name: '女',
  //   code: 'gender_female',
  //   rank: 2,
  //   parent_id: parent_1.category_id
  // })

  // // testing send email.
  // const sendMailResult = await MailUtil.sendMail({
  //   receiver: 'cn.shperry@gmail.com',
  //   subject: 'Test sending email with nodeJS',
  //   text: 'Hello! This is a test email sent with nodeJS.'
  // })
  // console.log('sendMailResult = ', sendMailResult)

  // // testing write data to csv file.
  // const fields = ['field3', 'field4', 'field1', 'field2']
  // const csv = json2csv({
  //   data: JSON.parse(JSON.stringify([
  //     {field1: 1, field2: 2, field3: 'aerg,你是谁,agt', field4: [{field41: 41, field42: 42}, {field41: 43, field42: 44}]},
  //     {field1: 11, field2: 12, field3: 13, field4: [{field41: 141, field42: 142}, {field41: 143, field42: 144}]}
  //   ])),
  //   fields
  // })

  // console.log('csv = ', csv)

  // fsPlus.writeFileSync('/Users/perry/Desktop/test.csv', '\uFEFF' + csv)
}

const sendRequest = async ({urlPath, method = 'get', params = {}, multipart = false, headers, queryString}) => {
  const protocol = 'http'
  const apiHost = 'localhost'
  const apiPort = '7443'

  let res

  switch (method) {
    case 'post':
      if (multipart) {
        res = await request.postAsync({
          url: !!queryString ? `${protocol}://${apiHost}:${apiPort}${urlPath}?${qs.stringify(queryString)}` :
            `${protocol}://${apiHost}:${apiPort}${urlPath}`,
          formData: params,
          headers,
        })
      } else {
        res = await request.postAsync({
          url: !!queryString ? `${protocol}://${apiHost}:${apiPort}${urlPath}?${qs.stringify(queryString)}` :
            `${protocol}://${apiHost}:${apiPort}${urlPath}`,
          body: params,
          headers,
          json: true
        })
      }

      break
    case 'patch':
      if (multipart) {
        res = await request.patchAsync({
          url: !!queryString ? `${protocol}://${apiHost}:${apiPort}${urlPath}?${qs.stringify(queryString)}` :
            `${protocol}://${apiHost}:${apiPort}${urlPath}`,
          formData: params,
          headers,
        })
      } else {
        res = await request.patchAsync({
          url: !!queryString ? `${protocol}://${apiHost}:${apiPort}${urlPath}?${qs.stringify(queryString)}` :
            `${protocol}://${apiHost}:${apiPort}${urlPath}`,
          body: params,
          headers,
          json: true
        })
      }

      break
    case 'get':
      res = await request.getAsync({
        url: !!queryString ? `${protocol}://${apiHost}:${apiPort}${urlPath}?${qs.stringify(queryString)}` :
          `${protocol}://${apiHost}:${apiPort}${urlPath}`,
        qs: params,
        headers,
        json: true
      })
      break
  }

  logger.info('visiting url => [', res.request.method, ']', res.request.uri.href, '\n data =>', params, '\n res = ', '{', '\n  statusCode:', res.statusCode, '\n  statusMessage:', res.statusMessage, '\n  body:', res.body, '\n}')

  return res
}

const testRedis = async (client) => {
  // await client.hmset('hosts', ['mjr', '1123', 'another', '23', 'home', '1234'])
  // await client.pipeline().set('k1', 'v1').set('k2', 'v2').exec()

  // const obj = await client.hgetall('hosts')
  // console.log('hgetall result: ', obj)

  // const results = await client.pipeline().get('k1').get('k2').exec()
  // console.log('pipeline results: ', results)

  // const results2 = await client.pipeline([
  //   ['get', 'k1'],
  //   ['get', 'k2']
  // ]).exec()
  // console.log('pipeline results 2: ', results2)

  // console.log(await RedisUtil.store(client, 'case_', '1', {a: 'a', case_id: '1'}))
  // console.log(await redisUtil.store(client, 'case_', '2', {b: 'b', case_id: '2'}))
  // console.log(await redisUtil.get(client, 'case_', '2'))
  // console.log(await redisUtil.multiGet(client, 'case_', ['2', '3']))
  // console.log(await redisUtil.del(client, 'case_', '41415'))

  // await client.flushdb()
}

export default async () => {
  await StoreGlobalDataUtil.storeGloabalCategories()

  // create new redis client.
  const client = await createRedisClient()

  // await sendRequest({
  //   urlPath: '/api/outside-lawyer/bids-documents/18/addtional-defecations',
  //   method: 'post',
  //   multipart: true,
  //   params: {
  //     filefield: 'files',
  //     files: fs.createReadStream('/Users/perry/Desktop/test.xlsx'),
  //     title: '测试标题',
  //     body: '测试内容'
  //   }
  // })

  // await testRedis(client)

  // await testSth(client)

  // console.log('before download')

  // download('http://gkstorage.oss-cn-hangzhou.aliyuncs.com/11/116b199c9a458e2986ac34d0e998b7581c94014d.dat?response-content-disposition=attachment%3B%20filename%3D%22aaabbcc.jpg%22%3B%20filename%2A%3Dutf-8%27%27aaabbcc.jpg&response-content-type=application%2Foctet-stream&OSSAccessKeyId=xAme5tplBBYJXFYm&Expires=1513664434&Signature=tC3Ai31a48b1dbUSkZVDtN1Eo%2F4%3D').then(data => {
  //   fs.writeFileSync('/Users/perry/DeskTop/testingDown.jpg', data)
  // })

  // console.log('after download')

  // disconnect client after set static data.
  client.disconnect()
}
