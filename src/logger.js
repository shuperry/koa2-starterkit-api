/* eslint-disable prefer-template */

import bunyan from 'bunyan'
import chalk from 'chalk'
import ip from 'ip'

import config from './config'

const ctx = new chalk.constructor({enabled: true})

const divider = ctx.gray('\n-----------------------------------')

const appStartedLogger = (protocol, name, port) => {
  console.log(name + ' server started successful ' + ctx.green('✓'))

  console.log(
    ctx.bold('\nAccess URLs:') +
    divider +
    '\nLocalhost: ' + ctx.magenta(protocol + '://localhost:' + port) +
    '\n      LAN: ' + ctx.magenta(protocol + '://' + ip.address() + ':' + port) +
    divider,
    ctx.blue('\nPress ' + ctx.italic('CTRL-C') + ' to stop\n')
  )
}

const env = config.get('environment')
const logLevel = config.get('log:level')

const streams = [
  {
    level: logLevel,
    stream: process.stdout
  }
]

const options = {
  src: env === 'local',
  name: config.get('name'),
  streams,
  serializers: bunyan.stdSerializers
}

export default bunyan.createLogger(options)

export {appStartedLogger}
