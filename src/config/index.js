import fs from 'fs'
import path from 'path'

import stripJsonComments from 'strip-json-comments'

import {Provider} from 'nconf/lib/nconf/provider'

const environment = process.env.NODE_ENV || 'local'
const appPath = process.cwd()
const nconf = new Provider()

nconf
  .add('new', {type: 'literal', store: {ab: 'ab'}})
  .add('app_env', {type: 'literal', store: JSON.parse(stripJsonComments(fs.readFileSync(path.join(__dirname, `${environment}.json`)).toString()))})
  .add('app_default', {type: 'literal', store: JSON.parse(stripJsonComments(fs.readFileSync(path.join(__dirname, 'default.json')).toString()))})

nconf.set('appPath', appPath)
nconf.set('environment', environment)

export default nconf
