import _ from 'lodash'

import config from '../config'

class RedisUtil {
  static app_key_prefix = config.get('redisServer:keyPrefix')

  constructor() {
  }

  static async store(redisClient, keyPrefix = '', key, objVal) {
    console.log('redis util store RedisUtil.app_key_prefix = ', RedisUtil.app_key_prefix)

    if (redisClient) {
      const res = await redisClient.set(RedisUtil.app_key_prefix + keyPrefix + key, JSON.stringify(objVal))
      return res === 'OK' ? 'OK' : 'wrong'
    }
  }

  static async get(redisClient, keyPrefix = '', key) {
    if (redisClient) {
      let res
      try {
        res = JSON.parse(await redisClient.get(RedisUtil.app_key_prefix + keyPrefix + key))
      } catch (e) {
        res = await redisClient.get(RedisUtil.app_key_prefix + keyPrefix + key)
      }
      return res
    }

    return null
  }

  static async multiGet(redisClient, keyPrefix = '', keys = []) {
    if (redisClient) {
      const multiGetArr = [], results = []

      if (_.isArray(keys)) {
        keys.forEach(key => multiGetArr.push([
          'get',
          RedisUtil.app_key_prefix + keyPrefix + key
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

  static async del(redisClient, keyPrefix = '', key) {
    if (redisClient) {
      const res = await redisClient.del(RedisUtil.app_key_prefix + keyPrefix + key)
      return res === 0 ? 'OK' : 'wrong'
    }
  }

  static async batchDel(redisClient, keyPrefix = '', keys = []) {
    if (redisClient) {
      const multiDelArr = []

      if (_.isArray(keys)) {
        keys.forEach(key => multiDelArr.push([
          'del',
          RedisUtil.app_key_prefix + keyPrefix + key
        ]))

        await redisClient.pipeline(multiDelArr).exec()
      }
    }
  }
}

export default RedisUtil
