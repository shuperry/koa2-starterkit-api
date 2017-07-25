export default {
  name: 'starterkit-api[UAT]',
  port: 10120,
  log: {
    level: 'warn'
  },
  uploadPath: '/apps/law/attachments/starterkit-api-uat',
  redisServer: {
    keyPrefix: 'startkit_uat_',
    name: 'starterkit-redis',
    host: '10.59.6.224',
    port: 16379,
    options: {
      connectionName: 'starterkit-redis-uat',
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
      secretKey: 'kzZsCGdoC955H8l1DQ2etbF',
      options: {
        expiresIn: '1d'
      }
    }
  },
  db: {
    database: 'starterkit',
    username: 'root',
    password: 'P@$$w0rd',
    options: {
      host: '10.59.6.224',
      port: 13306,
      dialect: 'mysql',
      timezone: '+08:00',
      logging: false,
      pool: {
        max: 100,
        min: 25,
        idle: 10000
      }
    }
  }
}
