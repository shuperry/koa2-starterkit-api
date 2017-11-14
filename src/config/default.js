export default {
  name: 'starterkit-api[DEV]',
  prefix: '/api',
  log: {
    'level': 'info'
  },
  bcryptSaltRounds: 10,
  requestMaxRespondTime: 60000,
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
  },
  mail: {
    sender: {
      service: 'qq',
      auth: {
        user: '576507045@qq.com',
        pass: 'xxxxx'
      }
    },
    options: {
      from: '舒培培 <576507045@qq.com>'
    },
    retryTimes: 5,
    retryInterval: 50
  },
  hooks: {
    i18n: {
      locales: [
        'en',
        'zh-CN'
      ],
      extension: '.json',
      modes: [
        'header',
        'tld',
        'subdomain',
        'url',
        'cookie',
        'query'
      ]
    }
  },
  page: {
    limit: 10
  },
  files: {
    maxUploadCount: 100
  }
}
