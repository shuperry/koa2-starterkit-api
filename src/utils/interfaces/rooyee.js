import _ from 'lodash'
import Promise from 'bluebird'
import request from 'request'
import qs from 'querystring'

import * as rooyeeHelper from '../../helpers/interfaces/rooyee-helper'

import config from '../../config'
import logger from '../../logger'

Promise.promisifyAll(request)

const createPictureMsgBroadcast = async ({recievers = [], title = '标题', hyperlink}) => {
  // 接收人去重处理.
  recievers = _.uniq(recievers)

  if (recievers.length > 0) {
    recievers.forEach(reciever => {
      rooyeeHelper.createPictureMsgBroadcast({
        toUser: reciever,
        title,
        hyperlink
      })
    })
  }
}

class SendBroadcaseUtil {
  constructor() {
  }

  // 消息 1: 新建案件，由 '案件创建人' 向 '案件相关干系人' 发送消息.
  createCase({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `您有一个新的案件【${_case.name}】，未上报。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 2-1: '进行中' 的案件状态改变 (普通进行中状态 => 普通进行中状态), 由 '主办律师' 向 '协助律师' 发送消息.
  updateStatusDuringProgressing_1({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】已进入【${_case.flow_status.name}】阶段，继续加油哦。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 2-2: '进行中' 的案件状态改变 (自定义状态 => 普通进行中状态), 由 '主办律师' 向 '协助律师' 发送消息.
  updateStatusDuringProgressing_2({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】已进入【${_case.flow_status.name}】阶段，继续加油哦。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 2-3: '进行中' 的案件状态改变 (普通进行中状态 => 自定义状态), 由 '主办律师' 向 '协助律师' 发送消息.
  updateStatusDuringProgressing_3({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】已进入【${_case.other_status_text}】阶段，继续加油哦。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 3 - 1: 正在进行的事件-临近截止日期72小时（3天）, 发送消息给 “相关当事人”.
  nearThreeDaysEndTime({case_id, case_ame, case_time_title, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `还有三个工作日，案件【${case_ame}】就要进入【${case_time_title}】状态。`,
      hyperlink: hyperlink + case_id
    })
  }

  // 消息 3 - 2: 正在进行的事件-截止日期当天, 发送消息给 “相关当事人”.
  currentDayEndTime({case_id, case_ame, case_time_title, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${case_ame}】今天就要进入【${case_time_title}】状态，请关注。`,
      hyperlink: hyperlink + case_id
    })
  }

  // 消息 4-1: 新增提醒日期, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  createCaseTime({ctx, _case, case_time, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】新增了一个提醒日期【${case_time.title}】，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 4-2: 修改提醒日期, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  updateCaseTime({ctx, _case, case_time, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】修改了一个提醒日期【${case_time.title}】，请关注。。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 6-1: 新增会议纪要, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  createMinute({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】新增了一个会议纪要，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 6-2: 修改会议纪要, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  updateMinute({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】修改了一个会议纪要，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 7-1: 新增OA签报, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  createOAWorkflow({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】新增了一个OA流程，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 7-2: 修改OA签报, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  updateOAWorkflow({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】修改了一个OA流程，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 8: 新案件/上报新案件-被驳回 -> 上报控股，由 '案件创建人' 向 '主办律师' 和 '协助律师' 发送消息.
  reportNewCase_toAll({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `新案件【${_case.name}】已上报，等待审批。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 9: 新案件/上报新案件-被驳回 -> 上报控股，由 '案件创建人' 向 '控股审批人' 发送消息.
  reportNewCase_toApprovers({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `请审批新案件【${_case.name}】。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 10: 上报控股待审批 -> 审批通过, 由 '控股审批人' 向 '主办律师' 和 '协助律师' 发送消息.
  reportNewCaseApprove_pass({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】已审批通过，现在可以着手处理啦。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 11: 上报控股待审批 -> 审批驳回, 由 '控股审批人' 向 '主办律师' 和 '协助律师' 发送消息.
  reportNewCaseApprove_reject({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】被驳回，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 14: 已判决-未执行 -> 已判决-执行中, 由 '主办律师' 向 '协助律师' 发送消息.
  judgeCase_doing({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】正在执行，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 15: 重大案件 进行中(上报结案-被驳回) -> 上报结案-待审批, 由 '主办律师' 向 '协助律师' 发送消息.
  reportCloseCase_toAll({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】结案申请已上报，等待审批。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 16: 重大案件 进行中(上报结案-被驳回) -> 上报结案-待审批, 由 '主办律师' 向 '控股审批人' 发送消息.
  reportCloseCase_toApprovers({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `请审批案件【${_case.name}】的结案申请。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 17: 重大案件 结案审批通过 上报结案-待审批 -> 已判决-未执行, 由 '控股审批人' 向 '案件相关干系人' 发送消息.
  reportCloseCaseApprove_pass({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】结案申请已审批通过，现在可以进入执行阶段了。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 18: 重大案件 结案审批驳回 上报结案-待审批 -> 上报结案-被驳回, 由 '控股审批人' 向 '案件相关干系人' 发送消息.
  reportCloseCaseApprove_reject({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】结案申请被驳回，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 19: 其它案件结案 进行中（普通进行中/自定义状态）-> 已判决-未执行, 由 '主办律师' 向 '案件相关干系人' 发送消息.
  closeOtherCase({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】已经最终判决，进入执行阶段了。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 20: 新案件启动 上报新案件-已审批 -> 进行中, 由 '主办律师' 向 '协助律师' 发送消息.
  newCaseStarted({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】已启动，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 21-1: 新增判决书, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  createJudgment({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】新增了一个判决书，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 21-2: 修改判决书, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  updateJudgment({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】修改了一个判决书，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 22-1: 新增执行报告, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  createExecReport({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】新增了一个执行报告，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 22-2: 修改执行报告, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  updateExecReport({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】修改了一个执行报告，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 23: 最终结案 已判决-执行中 -> 已结案, 由 '主办律师' 向 '相关干系人' 发送消息.
  closeCase({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】已经最终执行完成，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 ?-1: 新增反诉诉求, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  createCounterClaim({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】新增了一个反诉诉求，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }

  // 消息 ?-2: 修改反诉诉求, 由 '动作执行者' 向 '主办律师' 和 '协助律师' 发送消息.
  updateCounterClaim({ctx, _case, hyperlink, senders, recievers}) {
    createPictureMsgBroadcast({
      senders,
      recievers,
      title: `案件【${_case.name}】修改了一个反诉诉求，请关注。`,
      hyperlink: hyperlink + _case.case_id
    })
  }
}

const sendRequest = async ({urlPath, method = 'get', params = {}, queryString = {}}) => {
  const protocol = config.get('gokuai:protocol')
  const apiHost = config.get('gokuai:apiHost')

  let res

  switch (method) {
    case 'post':
      res = await request.postAsync({
        url: `${urlPath}?${qs.stringify(queryString)}`,
        body: params,
        json: true
      })
      break
    case 'get':
      res = await request.getAsync({
        url: `${urlPath}?${qs.stringify(queryString)}`,
        qs: params,
        json: true
      })
      break
  }

  logger.info('visiting url => [', res.request.method, ']', res.request.uri.href, '\n data =>', params, '\n res = ', '{', '\n  statusCode:', res.statusCode, '\n  statusMessage:', res.statusMessage, '\n  body:', res.body, '\n}')

  return res
}

class RooyeeApiExecutor {
  constructor() {
    const protocol = config.get('rooyee:protocol')
    const host = config.get('rooyee:host')
    const port = config.get('rooyee:port')

    this.server = `${protocol}://${host}:${port}`
    this.queryString = config.get('rooyee:queryString')
    this.rtpwebid = config.get('rooyee:queryString:rtpwebid')
    this.appkey = config.get('rooyee:appKey')
  }

  async authToken({rtp_token}) {
    const apiConf = config.get('rooyee:apis:authToken')

    const params = {
      token: rtp_token
    }

    return await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params,
      queryString: this.queryString
    })
  }

  /**
   发送广播消息(用户 -> 用户).
   params：
   rtpwebid  String  true  源名称
   user  string  true  发送人, 空代表系统
   orgName string  true  接收组织, 组织名称全路径,例如level/level_1
   toUser  string  true  接收人, 接收人的jid或用户名
   noticeType  string  true  通知类型：normal普通通知, headline系统通知, 仅在线用户可以收到系统通知
   noticeRange string  true  通知范围：normal普通通知分全部 (all) 和仅在线用户 (online), headline系统通知, 仅在线用户可以收到系统通知, 则为空
   msgType string  true  消息类型, 分文本消息, 图文消息和多图文消息三种, 即 text, picture 和 newsgroups
   params  string  true  对应类型的参数, 必须是符合json规范的字符串。 当 msgType = picture时, 可用参数如下：{title: 标题,picture: 图片内容,brief: 简介,hyperlink: 超链接 }；当 msgType = newsgroups 时, 可用参数如下：{msgs:[{text:说明,img:图片,url:超链接},...]}；当 msgType = text时, 可用参数如下：{msg: 消息内容}
   */
  async sendBroadcast({user = '', orgName = '', toUser, noticeType = 'normal', noticeRange = 'all', msgType = 'text', params = JSON.stringify({msg: '您有新的消息'})}) {
    const apiConf = config.get('rooyee:apis:sendBroadcast')

    const apiParams = {
      user,
      // orgName, // we don't need this param.
      toUser,
      noticeType,
      noticeRange,
      msgType,
      params
    }

    const res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params: apiParams,
      queryString: this.queryString
    })

    return {
      flag: res.statusCode === 200
    }
  }

  /**
   发送广播消息(用户 -> 用户).
   params：
   rtpwebid  String  true  源名称
   user  string  true  发送人, 空代表系统
   orgName string  true  接收组织, 组织名称全路径,例如level/level_1
   toUser  string  true  接收人, 接收人的jid或用户名
   noticeType  string  true  通知类型：normal普通通知, headline系统通知, 仅在线用户可以收到系统通知
   noticeRange string  true  通知范围：normal普通通知分全部 (all) 和仅在线用户 (online), headline系统通知, 仅在线用户可以收到系统通知, 则为空
   msgType string  true  消息类型, 分文本消息, 图文消息和多图文消息三种, 即 text, picture 和 newsgroups
   params  string  true  对应类型的参数, 必须是符合json规范的字符串。 当 msgType = picture时, 可用参数如下：{title: 标题,picture: 图片内容,brief: 简介,hyperlink: 超链接 }；当 msgType = newsgroups 时, 可用参数如下：{msgs:[{text:说明,img:图片,url:超链接},...]}；当 msgType = text时, 可用参数如下：{msg: 消息内容}
   */
  async sendPictureBroadcast({user = '', orgName = '', toUser, noticeType = 'normal', noticeRange = 'all', msgType = 'picture', title = '标题', picture = config.get('rooyee:broadcast:defaultImage'), brief = ' ', hyperlink = ''}) {
    const apiConf = config.get('rooyee:apis:sendBroadcast')

    const params = {
      user,
      // orgName, // we don't need this param.
      toUser,
      noticeType,
      noticeRange,
      msgType,
      params: JSON.stringify({
        title,
        picture,
        brief,
        hyperlink
      })
    }

    const res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params,
      queryString: this.queryString
    })

    if (res.statusCode === 200) {
      return {flag: true}
    }

    return {
      flag: false,
      errorCode: res.statusCode,
      errorMsg: res.statusMessage
    }
  }

  /**
   修改应用角标(数字).
   params：
   rtpwebid  String  true  源名称
   appkey  string  true  应用标识
   user  string  true  用户标识:可以有三种形式：用户名, jid, 用户名！源
   badge string  true  应用角标
   */
  async setBadgeForApp({user = '', badge = 0}) {
    const apiConf = config.get('rooyee:apis:setAppBadge')

    const params = {
      rtpwebid: this.rtpwebid,
      appkey: this.appkey,
      user,
      badge
    }

    const res = await sendRequest({
      urlPath: `${this.server}${apiConf.path}`,
      method: apiConf.method,
      params,
      queryString: this.queryString
    })

    return {
      flag: res.statusCode === 200
    }
  }
}

export const sendBroadcaseUtil = new SendBroadcaseUtil()
export const rooyeeApiExecutor = new RooyeeApiExecutor()
