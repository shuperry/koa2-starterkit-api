import _ from 'lodash'

import config from '../config'

const app_key_prefix = config.get('redisServer:keyPrefix')

const store = async (redisClient, keyPrefix = '', key, objVal) => {
  if (redisClient) {
    const res = await redisClient.set(app_key_prefix + keyPrefix + key, JSON.stringify(objVal))
    return res === 'OK' ? 'OK' : 'wrong'
  }
}

const get = async (redisClient, keyPrefix = '', key) => {
  if (redisClient) {
    let res
    try {
      res = JSON.parse(await redisClient.get(app_key_prefix + keyPrefix + key))
    } catch (e) {
      res = await redisClient.get(app_key_prefix + keyPrefix + key)
    }
    return res
  }

  return null
}

const multiGet = async (redisClient, keyPrefix = '', keys = []) => {
  if (redisClient) {
    const multiGetArr = [], results = []

    if (_.isArray(keys)) {
      keys.forEach(key => multiGetArr.push([
        'get',
        app_key_prefix + keyPrefix + key
      ]))

      const vals = await redisClient.pipeline(multiGetArr).exec()
      vals.forEach(valArr => {
        try {
          results.push(JSON.parse(valArr[1]))
        } catch (e) {
          results.push(valArr[1])
        }
      })
    }

    return results
  }

  return null
}

const del = async (redisClient, keyPrefix = '', key) => {
  if (redisClient) {
    const res = await redisClient.del(app_key_prefix + keyPrefix + key)
    return res === 0 ? 'OK' : 'wrong'
  }
}

const batchDel = async (redisClient, keyPrefix = '', keys = []) => {
  if (redisClient) {
    const multiDelArr = []

    if (_.isArray(keys)) {
      keys.forEach(key => multiDelArr.push([
        'del',
        app_key_prefix + keyPrefix + key
      ]))

      await redisClient.pipeline(multiDelArr).exec()
    }
  }
}

export {store, get, multiGet, del, batchDel}
