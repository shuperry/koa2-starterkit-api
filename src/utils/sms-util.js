/**
 * Created by perry on 2017/7/3.
 */
import _ from 'lodash'
import Promise from 'bluebird'
import qs from 'querystring'
import request from 'request'
import urlencode from 'urlencode'
import S from 'string'

import config from '../config'
import logger from '../logger'

Promise.promisifyAll(request)

const sendRequest = async ({urlPath, method = 'get', params = {}, queryString = {}}) => {
  const protocol = config.get('sms:protocol')
  const host = config.get('sms:host')
  const port = config.get('sms:port')

  let res

  switch(method) {
    case 'get':
      res = await request.getAsync({
        url: `${protocol}://${host}:${port}${urlPath}?${S(qs.stringify(queryString)).replaceAll('%25', '%').replaceAll('%2B', '')}`,
        json: true
      })
      break
  }

  logger.info('visiting url => [', res.request.method, ']', res.request.uri.href, '\n data =>', params, '\n res = ',
    '{', '\n  statusCode:', res.statusCode, '\n  statusMessage:', res.statusMessage, '\n  body:', res.body, '\n}')

  return res
}

class SMSApiExecutor {
  constructor() {
    this.corpid = config.get('sms:corpid')
    this.login_name = config.get('sms:login_name')
    this.password = config.get('sms:password')
    this.sms_template = config.get('sms:sms_template')
    this.expire_minutes = config.get('sms:expire_minutes')
    this.sms_code_length = config.get('sms:sms_code_length')
  }

  async sendCodeSMS({mobile, sms_code}) {
    logger.info('into sms util sendCodeSMS fcuntion with mobile =', mobile, 'sms_code =', sms_code, 'expire_minutes =', this.expire_minutes)
    logger.info('into sms util sendCodeSMS fcuntion with un_encoded =', this.getSMSContentBySMSCode({sms_code}))

    const apiConf = config.get('sms:apis:sendSMS')

    const queryString = {
      CorpID: this.corpid,
      LoginName: this.login_name,
      Passwd: this.password,
      LongSms: 0,
      send_no: mobile,
      msg: S(sms_code + urlencode(this.sms_template.part_1, 'gbk')).replaceAll('%20', '+').s
    }

    return await sendRequest({
      urlPath: apiConf.path,
      method: apiConf.method,
      params: {},
      queryString
    })
  }

  async sendSMS({mobile, content}) {
    logger.info('into sms util sendSMS fcuntion with mobile =', mobile, 'content =', content)

    const apiConf = config.get('sms:apis:sendSMS')

    const queryString = {
      CorpID: this.corpid,
      LoginName: this.login_name,
      Passwd: this.password,
      LongSms: 1,
      send_no: mobile,
      msg: S(urlencode(content, 'gbk')).replaceAll('%20', '+').s
    }

    return await sendRequest({
      urlPath: apiConf.path,
      method: apiConf.method,
      params: {},
      queryString
    })
  }

  async batchSendSMS({mobiles = [], content}) {
    logger.info('into sms util batchSendSMS fcuntion with mobiles =', mobiles, 'content =', content)

    const apiConf = config.get('sms:apis:sendSMS')

    let queryString
    for (let i = 0; i < mobiles.length; i++) {
      queryString = {
        CorpID: this.corpid,
        LoginName: this.login_name,
        Passwd: this.password,
        LongSms: 1,
        send_no: mobiles[i],
        msg: S(urlencode(content, 'gbk')).replaceAll('%20', '+').s
      }

      await sendRequest({
        urlPath: apiConf.path,
        method: apiConf.method,
        params: {},
        queryString
      })
    }
  }

  getSMSContentBySMSCode({sms_code}) {
    return sms_code + this.sms_template.part_1
  }

  getRandomSMSCode() {
    let random_code = ''
    for(let i = 0; i < this.sms_code_length; i++) {
      random_code += _.random(9)
    }

    return random_code
  }
}

export default new SMSApiExecutor()
