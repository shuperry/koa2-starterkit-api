export default {
  name: 'starterkit-api[DEV]',
  port: 7443,
  log: {
    level: 'debug'
  },
  uploadPath: '/apps/crpower/attachments/starterkit-api-dev',
  redisServer: {
    keyPrefix: 'starterkit_dev_',
    name: 'starterkit-redis-dev',
    host: '10.59.6.209',
    port: 6379,
    options: {
      connectionName: 'starterkit-redis-dev',
      family: '4',
      db: 1,
      password: '3bGp1IdpcvB1MjSpfBZj0Gdsjawj1uBt',
      showFriendlyErrorStack: true
    }
  },
  auth: {
    urls: [
    ],
    passUrls: [
    ],
    cookie: {
      token: 'starterkit-jwt',
      expiresDays: 30,
      options: {
      }
    },
    jwt: {
      secretKey: 'vMmYHnAppJGcQK1omzWx1Mt',
      options: {
        expiresIn: '1d'
      }
    }
  },
  db: {
    database: 'starterkit-dev',
    username: 'root',
    password: 'crP@ssw0rd',
    options: {
      host: '10.59.6.209',
      port: 3306,
      dialect: 'mysql',
      timezone: '+08:00',
      logging: false,
      pool: {
        max: 50,
        min: 15,
        idle: 10000
      }
    }
  }
}
