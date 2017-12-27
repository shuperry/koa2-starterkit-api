import path from 'path'

import {Provider} from 'nconf/lib/nconf/provider'

const environment = process.env.NODE_ENV || 'local'
const nconf = new Provider()

const appPath = process.cwd()

const globalConf = {
  appPath,
  environment
}

const defaultConf = require(path.join(__dirname, 'default')).default
const envConf = require(path.join(__dirname, `${environment}`)).default

const splitConfFileName = envConf['split_single_conf_file']['conf_file_name'] || defaultConf['split_single_conf_file']['conf_file_name']
const splitConf = require(path.join(appPath, splitConfFileName)).default

nconf
  .add('global', {
    type: 'literal',
    store: globalConf
  })
  .add('split_conf', {
    type: 'literal',
    store: splitConf
  })
  .add('app_env', {
    type: 'literal',
    store: envConf
  })
  .add('app_default', {
    type: 'literal',
    store: defaultConf
  })

export default nconf
