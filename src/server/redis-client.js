import Redis from 'ioredis'

import config from '../config'
import logger from '../logger'

export default async () => {
  const client = new Redis(config.get('redisServer:port'), config.get('redisServer:host'),
    config.get('redisServer:options'))

  client.on('connect', () => {
    logger.info('redis server connected...')
  })

  client.on('ready', () => {
    logger.info('redis client is ready...')
  })

  client.on('error', err => {
    logger.error('error from redis client:', err)
  })

  client.on('close', () => {
    logger.info('redis client closed...')
  })

  client.on('reconnecting', err => {
    logger.info('redis client reconnecting...', err)
  })

  client.on('end', () => {
    logger.info('redis client ended...')
  })

  return client
}
