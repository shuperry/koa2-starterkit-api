import fs from 'fs'
import fsPlus from 'fs-plus'

import _ from 'lodash'
import md5 from 'md5'
import Promise from 'bluebird'
import crypto from 'crypto'
import request from 'request'

import config from '../../config'
import logger from '../../logger'

Promise.promisifyAll(request)

const hex = ['%00', '%01', '%02', '%03', '%04', '%05', '%06', '%07', '%08', '%09', '%0A', '%0B', '%0C', '%0D', '%0E', '%0F', '%10', '%11', '%12', '%13', '%14', '%15', '%16', '%17', '%18', '%19', '%1A', '%1B', '%1C', '%1D', '%1E', '%1F', '%20', '%21', '%22', '%23', '%24', '%25', '%26', '%27', '%28', '%29', '%2A', '%2B', '%2C', '%2D', '%2E', '%2F', '%30', '%31', '%32', '%33', '%34', '%35', '%36', '%37', '%38', '%39', '%3A', '%3B', '%3C', '%3D', '%3E', '%3F', '%40', '%41', '%42', '%43', '%44', '%45', '%46', '%47', '%48', '%49', '%4A', '%4B', '%4C', '%4D', '%4E', '%4F', '%50', '%51', '%52', '%53', '%54', '%55', '%56', '%57', '%58', '%59', '%5A', '%5B', '%5C', '%5D', '%5E', '%5F', '%60', '%61', '%62', '%63', '%64', '%65', '%66', '%67', '%68', '%69', '%6A', '%6B', '%6C', '%6D', '%6E', '%6F', '%70', '%71', '%72', '%73', '%74', '%75', '%76', '%77', '%78', '%79', '%7A', '%7B', '%7C', '%7D', '%7E', '%7F', '%80', '%81', '%82', '%83', '%84', '%85', '%86', '%87', '%88', '%89', '%8A', '%8B', '%8C', '%8D', '%8E', '%8F', '%90', '%91', '%92', '%93', '%94', '%95', '%96', '%97', '%98', '%99', '%9A', '%9B', '%9C', '%9D', '%9E', '%9F', '%A0', '%A1', '%A2', '%A3', '%A4', '%A5', '%A6', '%A7', '%A8', '%A9', '%AA', '%AB', '%AC', '%AD', '%AE', '%AF', '%B0', '%B1', '%B2', '%B3', '%B4', '%B5', '%B6', '%B7', '%B8', '%B9', '%BA', '%BB', '%BC', '%BD', '%BE', '%BF', '%C0', '%C1', '%C2', '%C3', '%C4', '%C5', '%C6', '%C7', '%C8', '%C9', '%CA', '%CB', '%CC', '%CD', '%CE', '%CF', '%D0', '%D1', '%D2', '%D3', '%D4', '%D5', '%D6', '%D7', '%D8', '%D9', '%DA', '%DB', '%DC', '%DD', '%DE', '%DF', '%E0', '%E1', '%E2', '%E3', '%E4', '%E5', '%E6', '%E7', '%E8', '%E9', '%EA', '%EB', '%EC', '%ED', '%EE', '%EF', '%F0', '%F1', '%F2', '%F3', '%F4', '%F5', '%F6', '%F7', '%F8', '%F9', '%FA', '%FB', '%FC', '%FD', '%FE', '%FF']

const hmac = (str, key) => {
  return crypto.createHmac('sha1', key).update(str, 'utf8').digest('base64')
}

const encodeUTF8 = (str) => {
  let char, charNum, chars = []

  for (let i = 0; i < str.length; i++) {
    char = str.charAt(i)
    charNum = str.charCodeAt(i)

    if ('A' <= char && char <= 'Z') { // 'A'..'Z'
      chars.push(char)
    } else if ('a' <= char && char <= 'z') { // 'a'..'z'
      chars.push(char)
    } else if ('0' <= char && char <= '9') { // '0'..'9'
      chars.push(char)
    } else if (char == '-' || char == '_' // unreserved
            || char == '.' || char == '!' || char == '~' || char == '*' || char == '\'' || char == '(' || char == ')') {
      chars.push(char)
    } else if (charNum <= 0x007f) { // other ASCII
      chars.push(hex[charNum])
    } else if (charNum <= 0x07FF) { // non-ASCII <= 0x7FF
      chars.push(hex[0xc0 | (charNum >> 6)])
      chars.push(hex[0x80 | (charNum & 0x3F)])
    } else { // 0x7FF < ch <= 0xFFFF
      chars.push(hex[0xe0 | (charNum >> 12)])
      chars.push(hex[0x80 | ((charNum >> 6) & 0x3F)])
      chars.push(hex[0x80 | (charNum & 0x3F)])
    }
  }

  return chars.join('')
}

const generateSignature = (query, key) => {
  const str = _.values(_.fromPairs(_.toPairs(query).sort())).join('\n')
  return encodeUTF8(encodeURI(hmac(str, key)))
}

const sendRequest = async ({urlPath, method = 'get', params = {}}) => {
  const protocol = config.get('gokuai:protocol')
  const apiHost = config.get('gokuai:apiHost')

  let res

  switch(method) {
    case 'post':
      res = await request.postAsync({
        url: urlPath,
        formData: params,
        json: true
      })
      break
    case 'get':
      res = await request.getAsync({
        url: urlPath,
        qs: params,
        json: true
      })
      break
  }

  logger.info('visiting url => [', res.request.method, ']', res.request.uri.href, '\n data =>', params, '\n res = ', '{', '\n  statusCode:', res.statusCode, '\n  statusMessage:', res.statusMessage, '\n  body:', res.body, '\n}')

  return res
}

class GokuaiApiExecutor {
  constructor() {
    const protocol = config.get('gokuai:protocol')
    const apiHost = config.get('gokuai:apiHost')

    // init private fields.
    this.mount_id = ''
    this.target_mount_id = ''
    this.token = ''
    this.refresh_token = ''
    this.exchange_token = ''
    this.authed = false
    this.uploadServer = `${protocol}://${apiHost}`

    this.server = `${protocol}://${apiHost}`
    this.domain = config.get('gokuai:domain')
    this.client_id = config.get('gokuai:client_id')
    this.client_key = config.get('gokuai:client_key')
  }

  async auth() {
    const apiConf = config.get('gokuai:apis:auth')

    let authFormData = config.get('gokuai:authFormData')

    authFormData['username'] = !!this.domain ? `${this.domain}\\${authFormData.username}` : authFormData.username
    authFormData['password'] = md5(authFormData.password)
    authFormData['client_id'] = this.client_id
    authFormData['sign'] = generateSignature(authFormData, this.client_key)

    const res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params: authFormData
    })

    if (res.statusCode === 200) { // HTTP_OK.
      this.token = res.body.access_token
      this.refresh_token = res.body.refresh_token
      this.authed = true
      this.authType = 'password'
    }

    return res
  }

  async authByRTPToken({rtp_token}) {
    const apiConf = config.get('gokuai:apis:auth')

    let authFormData = {
      grant_type: 'exchange_token',
      exchange_token: rtp_token,
      auth: '',
      domain: this.domain,
      client_id: this.client_id
    }

    authFormData['sign'] = generateSignature(authFormData, this.client_key)

    const res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params: authFormData
    })

    if (res.statusCode === 200) { // HTTP_OK.
      this.token = res.body.access_token
      this.refresh_token = res.body.refresh_token
      this.authed = true
      this.authType = 'exchange_token'
      this.exchange_token = rtp_token
    }

    return res
  }

  async getAccountInfo() {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    const apiConf = config.get('gokuai:apis:getAccountInfo')

    const params = {
      token: this.token
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    return res
  }

  async refreshToken() {
    const apiConf = config.get('gokuai:apis:auth')
    const params = {
      grant_type: 'refresh_token',
      refresh_token: this.refresh_token,
      client_id: this.client_id
    }

    params['sign'] = generateSignature(params, this.client_key)

    const res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 200) { // HTTP_OK.
      this.token = res.body.access_token
      this.refresh_token = res.body.refresh_token
    }
  }

  async getMountList() {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    const apiConf = config.get('gokuai:apis:getMountList')

    const params = {
      token: this.token
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    if (res.statusCode === 200) { // HTTP_OK.
      const mount_id = _.find(res.body.list, {org_name: config.get('gokuai:mountName')}).mount_id

      this.mount_id = mount_id
      this.target_mount_id = mount_id
    }

    return res
  }

  async createFolder({fullpath}) {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    // before request we need to get mount.
    if (!this.mount_id) {
      await this.getMountList()
    }

    const apiConf = config.get('gokuai:apis:createFolder')

    const params = {
      mount_id: this.mount_id,
      fullpath,
      token: this.token
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    return res
  }

  async getUploadSever({fullpath}) {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    // before request we need to get mount.
    if (!this.mount_id) {
      await this.getMountList()
    }

    const apiConf = config.get('gokuai:apis:getUploadSever')

    const params = {
      mount_id: this.mount_id,
      fullpath,
      token: this.token
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    if (res.statusCode === 200) { // HTTP_OK.
      this.uploadServer = res.body.server
    }

    return res
  }

  async uploadFile({fullpath, localPath, overWrite = false, localFile}) {
    if (!fs.existsSync(localPath)) {
      return 'fileNotExists'
    }

    // 文件存在但不完整.
    if (!!localFile && fsPlus.getSizeSync(localPath) !== localFile.file_size) {
      return 'fileNotComplete'
    }

    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    // before request we need to get mount.
    if (!this.mount_id) {
      await this.getMountList()
    }

    // upload file need to get upload server first.
    await this.getUploadSever({fullpath})

    const apiConf = config.get('gokuai:apis:uploadFile')

    const params = {
      mount_id: this.mount_id,
      fullpath,
      token: this.token,
      overwrite: overWrite ? 1 : 0
    }

    const formData = _.extend({}, params, {
      filefield: 'file',
      sign: generateSignature(params, this.client_key),
      file: fs.createReadStream(localPath)
    })

    let res = await sendRequest({
      urlPath: `${this.uploadServer}${apiConf.path}`,
      method: apiConf.method,
      params: formData
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.uploadServer}${apiConf.path}`,
        method: apiConf.method,
        params: formData
      })
    }

    return res
  }

  async getFileInfo({fullpath, hid = ''}) {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    // before request we need to get mount.
    if (!this.mount_id) {
      await this.getMountList()
    }

    const apiConf = config.get('gokuai:apis:getFileInfo')

    const params = {
      mount_id: this.mount_id,
      fullpath,
      token: this.token,
      hid
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    return res
  }

  async delFile({fullpath}) {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    // before request we need to get mount.
    if (!this.mount_id) {
      await this.getMountList()
    }

    const apiConf = config.get('gokuai:apis:delFile')

    const params = {
      mount_id: this.mount_id,
      fullpath,
      token: this.token
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    return res
  }

  async renameFile({fullpath, newname}) {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    // before request we need to get mount.
    if (!this.mount_id) {
      await this.getMountList()
    }

    const apiConf = config.get('gokuai:apis:renameFile')

    const params = {
      mount_id: this.mount_id,
      fullpath,
      newname,
      token: this.token
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    return res
  }

  // target_fullpath must be a folder.
  async moveFile({fullpath, target_fullpath}) {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    // before request we need to get mount.
    if (!this.mount_id) {
      await this.getMountList()
    }

    const apiConf = config.get('gokuai:apis:moveFile')

    const params = {
      mount_id: this.mount_id,
      fullpath,
      target_mount_id: this.target_mount_id,
      target_fullpath,
      token: this.token
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    return res
  }

  // target_fullpath must be a folder.
  async copyFile({fullpath, target_fullpath}) {
    // if has not authed, then auth first.
    if (!this.authed) {
      await this.auth()
    }

    // before request we need to get mount.
    if (!this.mount_id) {
      await this.getMountList()
    }

    const apiConf = config.get('gokuai:apis:copyFile')

    const params = {
      mount_id: this.mount_id,
      fullpath,
      target_mount_id: this.target_mount_id,
      target_fullpath,
      token: this.token
    }

    params['sign'] = generateSignature(params, this.client_key)

    let res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params
    })

    if (res.statusCode === 401) { // HTTP_UNAUTHORIZED.
      // if unauthorized, we need to refresh token.
      await this.refreshToken()

      res = await sendRequest({
        urlPath: `${this.server}${apiConf.path}`,
        method: apiConf.method,
        params
      })
    }

    return res
  }
}

export const gokuaiApiExecutor = new GokuaiApiExecutor()
