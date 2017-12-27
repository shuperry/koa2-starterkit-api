import path from 'path'
import {exec} from 'child_process'

import _ from 'lodash'
import filewatcher from 'filewatcher'

import config from '../config'

const watcher = filewatcher()
watcher.add(path.join(config.get('appPath'), config.get('split_single_conf_file:conf_file_name')))

const restart_pm2_app_names = config.get('split_single_conf_file:pm2_app_names')

export default async () => {
  watcher.on('change', () => {
    if (_.isArray(restart_pm2_app_names)) {
      console.log('restart apps')
      restart_pm2_app_names.forEach(pm2_app_name => exec(`pm2 restart ${pm2_app_name}`))
    }
  })
}
