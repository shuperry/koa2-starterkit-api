import nodemailer from 'nodemailer'
import merge from 'lodash.merge'

import config from '../config'

const transporter = nodemailer.createTransport(config.get('mail:sender'))

const mailOptions = merge({}, config.get('mail:options'))

/**
 *
 * @param receiver 收件人
 * @param subject 主题
 * @param text 文本格式邮件内容
 * @param html 网页格式邮件内容
 * @returns {Promise.<void>}
 */
const sendMail = async ({receiver, subject, text, html}) => {
  await transporter.sendMail(merge({}, mailOptions, {
    to: receiver,
    subject,
    text,
    html
  }))
}

export {sendMail}
