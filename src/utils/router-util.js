import _ from 'lodash'
import keys from 'lodash.keys'
import S from 'string'
import isTimestamp from 'validate.io-timestamp'
import isJSON from 'validate.io-json'

class RouterUtil {
  constructor() {
  }

  /**
   * utils funciton to check router reuqired params.
   Demo:
   // check required param.
   const checkMsg = checkRequireParam(params, [{or: ['email', 'mobile']}, 'username', 'password'], [{or: ['邮箱', '手机号码']}, '用户名', '密码'])
   if (true !== checkMsg) {
      ctx.body = {status: 400, error: checkMsg}
      return
   }
   */
  checkRequireParam(param = {}, paramNames = [], messageNames = []) {
    let message = '', checkFlag = false

    paramNames.forEach((paramName, i) => {
      if (typeof paramName === 'string') {
        if (!(!_.isUndefined(param[paramName]) && param[paramName] !== 'undefined' && param[paramName] !== 'null')) {
          message += ((messageNames[i] || paramName) + '、')
        }
      } else if (typeof paramName === 'object') {
        let {or} = paramName, subParamName

        checkFlag = false

        for (let j = 0; j < or.length; j++) {
          subParamName = or[j]
          if (param[subParamName] && param[subParamName] !== 'undefined') {
            checkFlag = true
            break
          }
        }

        if (!checkFlag) {
          message += ('[' + (((messageNames[i] || {})['or'] || []).join('或') || (or || []).join('或')) + ']')
        }
      }
    })

    if (message.length === 0) return true

    // 去除最后多余的顿号.
    message = S(message).endsWith('、') ? message.substring(0, message.length - 1) : message

    return '缺失以下参数 (' + message + ')'
  }

  /**
   * common funciton to check router exclude params.
   Demo:
   // check exclude param.
   const checkMsg = checkExcludeParam(params, [{or: ['email', 'mobile']}, 'username', 'password'], [{or: ['邮箱', '手机号码']}, '用户名', '密码'])
   if (true !== checkMsg) {
     ctx.body = {status: 400, error: checkMsg}
     return
   }
   */
  checkExcludeParam(param = {}, paramNames = [], messageNames = []) {
    let message = '', checkFlag = false

    paramNames.forEach((paramName, i) => {
      if (typeof paramName === 'string') {
        if ((!_.isUndefined(param[paramName]) && param[paramName] !== 'undefined' && param[paramName] !== 'null')) {
          message += ((messageNames[i] || paramName) + '、')
        }
      } else if (typeof paramName === 'object') {
        let {or} = paramName, subParamName

        checkFlag = false

        for (let j = 0; j < or.length; j++) {
          subParamName = or[j]
          if (param[subParamName] && param[subParamName] !== 'undefined') {
            checkFlag = true
            break
          }
        }

        if (checkFlag) {
          message += ('[' + (((messageNames[i] || {})['or'] || []).join('或') || (or || []).join('或')) + ']')
        }
      }
    })

    if (message.length === 0) return true

    // 去除最后多余的顿号.
    message = S(message).endsWith('、') ? message.substring(0, message.length - 1) : message

    return '此接口不允许包含以下参数 (' + message + ')'
  }

  /**
   * utils funciton to check router params type, param type support: integer, float, double, string, array, object, date.
   Demo:
   // check param types.
   const checkParamTypeMsg = checkParamType(params, ['email', {name: 'mobile', type: 'integer'}], ['邮箱', '手机号码'])
   if (true !== checkParamTypeMsg) {
     ctx.body = {status: 400, error: checkParamTypeMsg}
     return
   }
   */
  checkParamType (param = {}, paramNames = [], messageNames = []) {
    let message = '', name = '', type = ''

    paramNames.forEach((paramName, i) => {
      if (typeof paramName === 'object') {
        name = paramName.name
        type = paramName.type
      } else if (typeof paramName === 'string') {
        name = paramName
      }

      // 字段类型默认值为字符串.
      type = type || 'string'

      if (!_.isUndefined(param[name])) {
        if (type === 'integer') {
          if (_.isNaN(Number.parseInt(param[name]))) {
            message += ((messageNames[i] || name) + '、')
          }
        } else if (type === 'float') {
          if (_.isNaN(Number.parseFloat(param[name]))) {
            message += ((messageNames[i] || name) + '、')
          }
        } else if (type === 'double') {
          if (_.isNaN(Number.parseDouble(param[name]))) {
            message += ((messageNames[i] || name) + '、')
          }
        } else if (type === 'array') {
          if (!_.isArray(param[name])) {
            message += ((messageNames[i] || name) + '、')
          }
        } else if (type === 'date') {
          if (!isTimestamp(param[name])) {
            message += ((messageNames[i] || name) + '、')
          }
        } else if (typeof param[name] !== type) {
          message += ((messageNames[i] || name) + '、')
        }
      }
    })

    if (message.length === 0) return true

    // 去除最后多余的顿号.
    message = S(message).endsWith('、') ? message.substring(0, message.length - 1) : message

    return '以下参数 (' + message + ') 数据类型不正确'
  }

  dealSpecialParam(params, ctx) {
    keys(params).forEach(key => {
      if (!!ctx && !!ctx.request && !!ctx.request['header'] && !!ctx.request['header']['content-type'] &&
        S(ctx.request['header']['content-type']).startsWith('multipart/form-data') && isJSON(params[key])) {
        params[key] = JSON.parse(params[key])
      } else if (_.isString(params[key]) && !isJSON(params[key])) {
        if (_.isNumber(Number(params[key])) && !_.isNaN(Number(params[key]))
          && isTimestamp(Number(params[key]))) { // deal date type value.
          params[key] = Number(params[key])
        } else if (_.trim(params[key]) === 'undefined' || _.trim(params[key]) === 'null' || _.trim(params[key]) === 'NaN') { // delete un-normal value.
          delete params[key]
        }
      }
    })
  }

  checkFileFieldParam(ctx, fileFieldNames = []) {
    let wronglength_message = '', missing_message = ''

    fileFieldNames.forEach(fileFieldName => {
      if (!!ctx.req.files) {
        if (_.isUndefined(ctx.req.files[fileFieldName])) {
          missing_message += (fileFieldName + '、')
        } else if (ctx.req.files[fileFieldName].length === 1) {
          wronglength_message += (fileFieldName + '、')
        }
      } else {
        missing_message += (fileFieldName + '、')
      }
    })

    // 去除最后多余的顿号.
    missing_message = S(missing_message).endsWith('、') ? missing_message.substring(0, missing_message.length - 1) : missing_message
    wronglength_message = S(wronglength_message).endsWith('、') ? wronglength_message.substring(0, wronglength_message.length - 1) : wronglength_message


    return '缺失以下附件参数 (' + missing_message + ') , 以下附件参数文件数量不正确 (' + wronglength_message + ')'
  }
}

export default new RouterUtil()
