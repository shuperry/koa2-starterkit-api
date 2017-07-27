import _ from 'lodash'
import async from 'async'
import Promise from 'bluebird'
import emailValidator from 'email-address'
import merge from 'lodash.merge'
import nodemailer from 'nodemailer'

import config from '../config'
import logger from '../logger'

Promise.promisifyAll(async)

class MailUtil {
  constructor() {
    this.mailOptions = merge({}, config.get('mail:options'))
  }

  getTransporter() {
    return nodemailer.createTransport(config.get('mail:sender'))
  }

  /**
   * 发送邮件给单独一个用户.
   *
   * @param receiver<Array> 收件人 (支持字符串和字符串数组格式).
   * @param subject 主题.
   * @param text 文本格式邮件内容.
   * @param html 网页格式邮件内容.
   *
   * @returnParam successful 邮件发送成功的邮件地址.
   * @returnParam failed 邮件发送失败的邮件地址.
   * @returnParam wrong 格式不正确的邮件地址.
   */
  async sendMail({receiver, subject, text, html}) {
    const seriesJobs = []
    const successful = [], failed = [], wrong = []

    const generageSeriesJobs = (receiver) => {
      if (!emailValidator.isValid(receiver)) {
        wrong.push(receiver)
        return
      }

      seriesJobs.push(async (callback) => {
        async.retry({
          times: config.get('mail:retryTimes'),
          interval: config.get('mail:retryInterval'),
          errorFilter: (err) => {
            return !!err
          }
        }, async (cb) => {
          try {
            await this.getTransporter().sendMail(merge({}, this.mailOptions, {
              to: receiver,
              subject,
              text,
              html
            }))

            logger.info('邮件发送成功 receiver = ', receiver)

            successful.push(receiver)

            cb(null)
          } catch (err) {
            logger.error('邮件发送失败 err = ', err)

            cb('failed.')
          }
        }, (err) => {
          if (!!err) { // final failed after retry.
            failed.push(receiver)
          }

          callback(null, receiver)
        })
      })
    }

    if (_.isArray(receiver)) {
      receiver.forEach(receiverItem => generageSeriesJobs(receiverItem))
    } else if (_.isString(receiver)) {
      generageSeriesJobs(receiver)
    }

    if (seriesJobs.length > 0) await async.seriesAsync(seriesJobs)

    return {
      successful,
      failed,
      wrong
    }
  }
}

export default new MailUtil()
