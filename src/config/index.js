import path from 'path'

import {Provider} from 'nconf/lib/nconf/provider'

const environment = process.env.NODE_ENV || 'local'
const appPath = process.cwd()
const nconf = new Provider()

nconf
  .argv()
  .env()
  .file('app_env', {file: path.join(__dirname, `${environment}.json`)})
  .file('app_default', {file: path.join(__dirname, 'default.json')})

nconf.set('appPath', appPath)
nconf.set('environment', environment)

export default nconf
