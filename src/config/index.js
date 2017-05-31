import fs from 'fs'
import path from 'path'

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
    store: require(path.join(__dirname, `${environment}`)).default
  })
  .add('app_default', {
    type: 'literal',
    store: require(path.join(__dirname, 'default')).default
  })

export default nconf
