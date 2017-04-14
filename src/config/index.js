import fs from 'fs'
import path from 'path'

import stripJsonComments from 'strip-json-comments'

import {Provider} from 'nconf/lib/nconf/provider'

const environment = process.env.NODE_ENV || 'local'
const nconf = new Provider()

const globalConf = {
  appPath: process.cwd(),
  environment
}

nconf
  .add('global', {
    type: 'literal',
    store: globalConf
  })
  .add('app_env', {
    type: 'literal',
    store: JSON.parse(stripJsonComments(fs.readFileSync(path.join(__dirname, `${environment}.json`)).toString()))
  })
  .add('app_default', {
    type: 'literal',
    store: JSON.parse(stripJsonComments(fs.readFileSync(path.join(__dirname, 'default.json')).toString()))
  })

export default nconf
