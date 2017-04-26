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
      host: 'smtp.crc.com.hk',
      port: 25,
      auth: false
    },
    options: {
      from: 'no.reply@crpower.com.cn'
    }
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
  },
  testTokens: {
    '9eh87828yw7pybri94ims63zf3ivsy63': 'rtptest1',
    'if5cuswa3765ojb4vl79a13bir4p7ezq': 'rtptest2',
    '4gwm7ealbpzxvri8rxczubictt3o75n7': 'rtptest3',
    '1k4fho7vmza4dm1liehmr0rxjsccmf82': 'rtptest4',
    'iv7fra9649c80f824op7jnqs6wocu98r': 'rtptest5',
    '0urt6q50gn2fqac6ajqhv0v5e0vmwbv2': 'rtptest6',
    'yzlf9xylw3zpcflb7jogad1znfwvhd6s': 'rtptest7',
    'vrarq3mrvz7we2t0bps7kalylrt245jx': 'rtptest8',
    'phoajfg3oeet49e3l7ncmfl6c6y0lorf': 'rtptest9',
    'ppj6zsab4vv86ijeyixwkk0wjydh8g1m': 'rtptest10',
    'h6cgzmr4dqdhm1u4um2bofjtww0voix6': 'rtptest11',
    'wsi6pwszd2ab8xvakth14w3ljk3dvfvs': 'rtptest12',
    'bq9by6q0bbd0hozel4of621pxm5tf5y6': 'rtptest13'
  }
}