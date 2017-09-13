export default {
  name: 'starterkit-api[DEV]',
  port: 7444,
  log: {
    level: 'debug'
  },
  uploadPath: '/Users/perry/crpower-workspace/testUpload/',

  // redis config.
  redisServer: {
    keyPrefix: 'starterkit_local_',
    name: 'starterkit-redis-local',
    host: '127.0.0.1',
    port: 6379,
    options: {
      connectionName: 'starterkit-redis-local',
      family: '4',
      db: 1, // this db will be used.
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
      secretKey: 'fjziITOVFqo5P7fSLRGilYZ',
      options: {
        expiresIn: '1d'
      }
    }
  },
  db: {
    database: 'starterkit',
    username: 'root',
    password: 'mysecretpassword',
    options: {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
      timezone: '+08:00',
      pool: {
        max: 50,
        min: 15,
        idle: 10000
      }
    }
  }
}
