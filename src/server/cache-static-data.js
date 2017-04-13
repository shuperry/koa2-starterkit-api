import path from 'path'

import keys from 'lodash.keys'
import values from 'lodash.values'
import fs from 'fs-plus'
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

import config from '../config'
import logger from '../logger'

import createRedisClient from './redis-client'

import * as categoryHelper from '../helpers/category-helper'

import {sendMail} from '../utils/mail-util'

Promise.promisifyAll(request)

const grantPermissionForNewData = async () => {
  const grantWithParentPermissions = [
    {user_id: 68, object_id: 95, access_mode: 3},
    {user_id: 69, object_id: 95, access_mode: 3},
    {user_id: 70, object_id: 95, access_mode: 3},
    {user_id: 75, object_id: 97, access_mode: 3},
    {user_id: 76, object_id: 97, access_mode: 3},
    {user_id: 74, object_id: 99, access_mode: 3},
    {user_id: 73, object_id: 100, access_mode: 3},
    {user_id: 71, object_id: 101, access_mode: 3},
    {user_id: 72, object_id: 101, access_mode: 3}
  ]

  const permissions = [
    {user_id: 13, object_id: 94, access_mode: 3},
    {user_id: 21, object_id: 94, access_mode: 3},
    {user_id: 23, object_id: 94, access_mode: 3},
    {user_id: 24, object_id: 94, access_mode: 3},
    {user_id: 58, object_id: 94, access_mode: 3},
    {user_id: 59, object_id: 94, access_mode: 3},
    {user_id: 60, object_id: 94, access_mode: 3},
    {user_id: 61, object_id: 94, access_mode: 3},
    {user_id: 62, object_id: 94, access_mode: 3},
    {user_id: 63, object_id: 94, access_mode: 3},
    {user_id: 68, object_id: 94, access_mode: 3},
    {user_id: 69, object_id: 94, access_mode: 3},
    {user_id: 70, object_id: 94, access_mode: 3},
    {user_id: 71, object_id: 94, access_mode: 3},
    {user_id: 72, object_id: 94, access_mode: 3},
    {user_id: 73, object_id: 94, access_mode: 3},
    {user_id: 74, object_id: 94, access_mode: 3},
    {user_id: 75, object_id: 94, access_mode: 3},
    {user_id: 76, object_id: 94, access_mode: 3}
  ]

  let permission

  for (let j = 0; j < permissions.length; j++) {
    permission = permissions[j]

    // await aclHelper.grantPermissionForUser({
    //   user_id: permission.user_id,
    //   object_id: permission.object_id,
    //   access_mode: permission.access_mode
    // })
  }
  for (let i = 0; i < grantWithParentPermissions.length; i++) {
    permission = grantWithParentPermissions[i]

    // await aclHelper.grantPermissionForUserWithParent({
    //   user_id: permission.user_id,
    //   object_id: permission.object_id,
    //   access_mode: permission.access_mode
    // })
  }
}

const createNewUsersAndGrantPermission = async () => {
  const {models} = legal

  const users = [
    // 控股总部.
    {
      sid: 'ZHANGXL',
      name: '张晓来',
      object_id: [
        46
      ],
      group_id: [
        7
      ],
      access_mode: 3
    }
  ]

  let user, userId, userSid,
    user_object_id, user_group_id,
    startUserId = 82

  for (let i = 0; i < users.length; i++) {
    user = users[i]
    userSid = user.sid
    userId = startUserId + i
    await models.User.create({
      user_id: userId,
      sid: userSid,
      email: `${userSid.toLowerCase()}@crpower.com.cn`,
      display_name: user.name,
      avatar: 'http://img.hidoge.cn/logo/logo-500x500.jpg?imageView2/1/w/200/h/200',
      sync_password: 'Abcd1234'
    })

    if (Array.isArray(user.object_id)) {
      for (let j = 0; j < user.object_id.length; j++) {
        user_object_id = user.object_id[j]

        // await aclHelper.grantPermissionForUser({
        //   user_id: userId,
        //   object_id: user_object_id,
        //   access_mode: user.access_mode
        // })
      }
    } else {
      // await aclHelper.grantPermissionForUser({
      //   user_id: userId,
      //   object_id: user.object_id,
      //   access_mode: user.access_mode
      // })
    }

    if (Array.isArray(user.group_id)) {
      for (let k = 0; k < user.group_id.length; k++) {
        user_group_id = user.group_id[k]

        await models.UserGroups.create({
          user_id: userId,
          group_id: user_group_id
        })
      }
    } else {
      await models.UserGroups.create({
        user_id: userId,
        group_id: user.group_id
      })
    }
  }
}

const createCompanies = async () => {
  const {models} = legal

  const companyNames = [
    '华润煤业控股有限公司',
    '华润煤业控股（山西）有限公司',
    '华润煤业(集团)有限公司',
    'AACI SAADEC （HK）Holdings Limited',
    '深圳瑞华能源投资有限公司',
    // '华润电力物流（天津）有限公司',
    '华润电力燃料（河南）有限公司',
    '山西华润煤焦运销有限公司',
    '山西华润宏宝煤业有限公司',
    // '湖南华润煤业有限公司',
    '湖南华润煤业唐洞煤矿有限公司',
    '湖南华润利民矿业有限公司',
    '涟源华润煤业有限公司',
    '贵州天润矿业有限公司',
    '贵州华隆煤业有限公司',
    '安顺市西秀区桦槁林煤矿有限公司',
    '威宁县振华煤矿',
    '河南永华能源有限公司',
    '河南天中煤业有限公司',
    '郑州华辕煤业有限公司',
    '徐州能源工业学校',
    '江苏天能集团公司军事化矿山救护队',
    // '华润天能徐州煤电有限公司',
    '华润天能矿用设备制造有限公司',
    '华润天能徐州矿业开发有限公司',
    '徐州铁骑驾驶员培训学校',
    // '山西华润联盛能源投资有限公司',
    '石楼县华润联盛介板沟煤业投资有限公司',
    '石楼县华润联赵家板沟煤业投资有限公司',
    '交口县华润联盛梁家沟煤业投资有限公司',
    '交口县华润联盛孟家焉煤业投资有限公司',
    '交口县华润联盛蔡家沟煤业投资有限公司',
    '山西临县华润联盛黄家沟煤业有限公司',
    '山西石楼华润联盛介板沟煤业有限公司',
    '山西石楼华润联盛赵家沟煤业有限公司',
    '山西交口华润联盛孟家焉煤业有限公司',
    '山西交口华润联盛梁家沟煤业有限公司',
    '山西交口华润联盛蔡家沟煤业有限公司',
    '山西兴县华润联盛峁底煤业有限公司',
    '山西中阳华润联盛苏村煤业有限公司',
    '山西兴县华润联盛关家崖煤业有限公司',
    '山西兴县华润联盛车家庄煤业有限公司',
    '临县星原水泥有限责任公司',
    '山西华通统配煤炭销售有限公司',
    // '山西华润煤业有限公司',
    // '太原华润煤业有限公司',
    '山西华润鸿福煤业有限公司',
    '山西华润昌裕煤业有限公司',
    // '山西华润大宁能源有限公司',
    '阳城亚美大宁铁路专线营运有限公司',
    '山西兰花大宁发电有限公司',
    '山西兰花大宁煤炭有限公司'
  ]

  let companyName, companyObj,
    startCompanyObjId = 281, companyObjId,
    parentId = 94, parentPath = '94/', parentNamePath = '煤炭事业部/',
    businessTypeId = 1014

  for (let i = 0; i < companyNames.length; i++) {
    companyName = companyNames[i]
    companyObjId = startCompanyObjId + i

    companyObj = await models.Object.create({
      object_id: companyObjId,
      name: companyName,
      type: 1,
      full_path: `${parentPath}${companyObjId}`,
      parent_id: parentId,
      business_type_id: businessTypeId
    })

    await models.Entity.create({
      entity_id: companyObj.object_id,
      name: companyName,
      type: 1,
      label: '煤炭',
      name_path: `${parentNamePath}${companyName}`,
      business_type_id: businessTypeId
    })
  }
}

const testSth = async (client) => {
  const {models, gokuaiApiExecutor, rooyeeApiExecutor} = legal

  // const parent_1 = await models.Category.create({
  //   name: '履行/执行报告业务类型',
  //   code: 'exec_report_business_type',
  //   rank: 20
  // })
  // await models.Category.create({
  //   name: '履行报告',
  //   code: 'exec_report_business_type_perform',
  //   relate_parent_code: 'case_judged_no_need_perform,case_judged_wait_perform,case_judged_performing',
  //   rank: 1,
  //   parent_id: parent_1.category_id
  // })
  // await models.Category.create({
  //   name: '执行报告',
  //   code: 'exec_report_business_type_do',
  //   relate_parent_code: 'case_judged_doing',
  //   rank: 2,
  //   parent_id: parent_1.category_id
  // })

  // await createLastNewUsersAndGrantPermission()

  // // testing send email.
  // await sendMail({
  //   to: 'no.reply@crpower.com.cn',
  //   subject: 'Test sending email with nodeJs',
  //   body: 'Hello! This is a test email sent with nodeJs.'
  // })

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

  // fs.writeFileSync('/Users/perry/Desktop/test.csv', '\uFEFF' + csv)

  // await gokuaiApiExecutor.auth()
  // await gokuaiApiExecutor.authByRTPToken({rtp_token: 'xxxxx'})
  // await gokuaiApiExecutor.refreshToken()
  // await gokuaiApiExecutor.getAccountInfo()
  // await gokuaiApiExecutor.getMountList()
  // await gokuaiApiExecutor.createFolder({
  //   fullpath: 'f3/f4'
  // })
  // await gokuaiApiExecutor.getUploadSever({fullpath: 'f1/f2'})
  // await gokuaiApiExecutor.uploadFile({
  //   fullpath: 'f5/f6/mini.jpg',
  //   localPath: '/Users/perry/Desktop/mini.jpg',
  //   overWrite: true
  // })
  // await gokuaiApiExecutor.getFileInfo({
  //   fullpath: 'f1/f2/test1.txt'
  // })
  // await gokuaiApiExecutor.delFile({
  //   fullpath: 'f3/f4/aguregtkgtjr.png'
  // })
  // await gokuaiApiExecutor.renameFile({
  //   fullpath: 'f1',
  //   newname: 'f2'
  // })
  // await gokuaiApiExecutor.moveFile({
  //   fullpath: 'f1',
  //   target_fullpath: 'f2'
  // })
  // await gokuaiApiExecutor.copyFile({
  //   fullpath: 'f1',
  //   target_fullpath: 'f2'
  // })

  // const oldImgBse64Str = base64Img.base64Sync('/Users/perry/Desktop/mini.jpg')
  // console.log('imgBse64Str old icon = ', oldImgBse64Str)
  //
  // const newImgBse64Str = base64Img.base64Sync('/Users/perry/Desktop/ico05_80x80.jpg')
  // console.log('imgBse64Str new icon = ', newImgBse64Str)
}

const testBatchCreateCase = async () => {
  const rtptest1_authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkX2F0IjoxNDg4ODY3MzU3MzQzLCJ1cGRhdGVkX2F0IjoxNDg4ODY3MzU3MzQ0LCJ1c2VyX2lkIjoxLCJzaWQiOiJSVFBURVNUMSIsInN5bmNfcGFzc3dvcmQiOiJBYmNkMTIzNCIsImVtYWlsIjoicnRwdGVzdDFAY3Jwb3dlci5jb20uY24iLCJlbWFpbF9lbmFibGUiOm51bGwsImVtYWlsX29wdGlvbnMiOm51bGwsImxhbmdfY29kZSI6IiIsImNvdW50cnlfY29kZSI6IiIsImRpc3BsYXlfbmFtZSI6InJ0cHRlc3QxIiwiYXZhdGFyIjoiaHR0cDovL2ltZy5oaWRvZ2UuY24vbG9nby9sb2dvLTUwMHg1MDAuanBnP2ltYWdlVmlldzIvMS93LzIwMC9oLzIwMCIsImNyZWF0ZWRfYnkiOm51bGwsInVwZGF0ZWRfYnkiOm51bGwsImdyb3VwcyI6W3siY3JlYXRlZF9hdCI6MTQ3NjY5OTE5NDU2MiwidXBkYXRlZF9hdCI6MTQ3NjY5OTE5NDU2MiwiZ3JvdXBfaWQiOjEsInNpZCI6ImhvbGRpbmdfaHEiLCJuYW1lIjoi5o6n6IKh5oC76YOo5rOV5Yqh57uEIiwicmVtYXJrIjoiIiwiY3JlYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9ieSI6bnVsbCwiVXNlckdyb3VwcyI6eyJncm91cF9pZCI6MSwidXNlcl9pZCI6MX19LHsiY3JlYXRlZF9hdCI6MTQ3NjY5OTE5NDU2MiwidXBkYXRlZF9hdCI6MTQ3NjY5OTE5NDU2MiwiZ3JvdXBfaWQiOjIsInNpZCI6ImhvbGRpbmdfcHJvZmVzc2lvbmFsX2NvcnAiLCJuYW1lIjoi5o6n6IKh5LiT5Lia5YWs5Y-45rOV5Yqh57uEIiwicmVtYXJrIjoiIiwiY3JlYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9ieSI6bnVsbCwiVXNlckdyb3VwcyI6eyJncm91cF9pZCI6MiwidXNlcl9pZCI6MX19XSwicm9sZXMiOlt7ImNyZWF0ZWRfYXQiOjE0NzY2OTkxOTQ1NjIsInVwZGF0ZWRfYXQiOjE0NzY2OTkxOTQ1NjIsInJvbGVfaWQiOjEsInNpZCI6ImFkbWluIiwibmFtZSI6ImFkbWluIiwicmVtYXJrIjoiIiwiY3JlYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9ieSI6bnVsbCwiVXNlclJvbGVzIjp7InJvbGVfaWQiOjEsInVzZXJfaWQiOjF9fV0sImF1dGhUeXBlIjoibG9naW4tZm9ybSIsImlhdCI6MTQ4ODg3Njg0Nn0.w7SdKZtuNMhZlFZAWZIxoFg5rKzBT6Cbziqs--I4cA4'

  const intervalSecond = 3, time = 1
  for (let i = 0; i < time; i++) {
    setTimeout(async function () {
      console.log('i = ', i)

      // await sendRequest({
      //   urlPath: '/api/categories',
      //   method: 'get',
      //   params: {
      //     code: 'case_status'
      //   }
      // })

      // await sendRequest({
      //   urlPath: '/api/users/auth',
      //   method: 'post',
      //   params: {
      //     sid: 'rtptest1'
      //   }
      // })

      await sendRequest({
        urlPath: '/api/cases',
        method: 'post',
        headers: {
          authorization: rtptest1_authorization
        },
        params: {
          name: '123',
          entity_id: 2,
          is_temporary: 1,
          important_level_id: 2,
          category_id: 8,
          our_party_role_id: 16,
          sign_amount: 1,
          remark: '123',
          first_level_cate_id: 487,
          second_level_cate_id: 488,
          started_date: 1488816000000,
          roles: [
            {
              role_id: 2,
              users: [2]
            }
          ],
          other_entity_names: '铜山华润电力有限公司',
          opponents: [
            {
              title: '123',
              role_id: 16,
              nature_id: 1066
            }
          ],
          is_need_outside_lawyer: 0
        }
      })
    }, intervalSecond * 1000 * (i + 1))
  }
}

const sendRequest = async ({urlPath, method = 'get', params = {}, headers, queryString}) => {
  const protocol = 'http'
  const apiHost = '127.0.0.1'
  const apiPort = '7443'

  let res

  switch (method) {
    case 'post':
      res = await request.postAsync({
        url: !!queryString ? `${protocol}://${apiHost}:${apiPort}${urlPath}?${qs.stringify(queryString)}` :
          `${protocol}://${apiHost}:${apiPort}${urlPath}`,
        body: params,
        headers,
        json: true
      })
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

  // console.log(await redisUtil.store(client, 'case_', '1', {a: 'a', case_id: '1'}))
  // console.log(await redisUtil.store(client, 'case_', '2', {b: 'b', case_id: '2'}))
  // console.log(await redisUtil.get(client, 'case_', '2'))
  // console.log(await redisUtil.multiGet(client, 'case_', ['2', '3']))
  // console.log(await redisUtil.del(client, 'case_', '41415'))

  // await client.flushdb()
}

export default async () => {
  // create new redis client.
  const client = await createRedisClient()

  let categoriesCodeMap = {},
    categoriesIdMap = {},
    categoryJson = {}

  const categories = await categoryHelper.getSimpleCategories({params: {}})
  categories.forEach(category => {
    categoryJson = JSON.parse(JSON.stringify(category))

    if (!_.isEmpty(categoryJson.code)) {
      categoriesCodeMap[categoryJson.code] = categoryJson
    }
    categoriesIdMap[categoryJson.category_id] = categoryJson
  })

  legal.categoriesCodeMap = categoriesCodeMap
  legal.categoriesIdMap = categoriesIdMap

  // await testRedis(client)

  await testSth(client)

  // await testBatchCreateCase()

  // await createCompanies()

  // await grantPermissionForNewData()

  // await createNewUsersAndGrantPermission()

  // disconnect client after set static data.
  client.disconnect()
}
