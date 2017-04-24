export default {
  name: 'starterkit-api[SIT]',
  port: 6443,
  log: {
    level: 'debug'
  },
  uploadPath: '/apps/crpower/attachments/starterkit-api-sit',
  redisServer: {
    name: 'starterkit-redis-sit',
    host: '10.59.6.209',
    port: 6379,
    options: {
      connectionName: 'starterkit-redis-sit',
      family: '4',
      db: 2,
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
      secretKey: 'ux49I9gbGkCvmgclDllDGDn',
      options: {
        expiresIn: '1d'
      }
    }
  },
  db: {
    database: 'starterkit-sit',
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
