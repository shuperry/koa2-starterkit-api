
## Backend as a service(BaaS) platform.

## Features

* **[es6](http://es6.ruanyifeng.com)**
* **[nconf](https://www.npmjs.com/package/nconf)**
* **[bunyan](https://www.npmjs.com/package/bunyan)**
* **[sequelize](http://docs.sequelizejs.com)**
* **[pm2](http://pm2.keymetrics.io/docs/usage/quick-start)**
* **[koa2](https://www.npmjs.com/package/koa2)**
* **[koa-router](https://www.npmjs.com/package/koa-router)**
* **[koa-multer](https://www.npmjs.com/package/koa-multer)**
* **[async / await](http://www.ruanyifeng.com/blog/2015/05/async.html)**
* **[decorator](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)**

## Quick start

1. Clone this repo using `git clone https://github.com/shuperry/starterkit-api.git`.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start service in local development mode.

## Configuration

We use [nconf](https://www.npmjs.com/package/nconf) to manage configuration between different environment, the configuration of current environment file name is just the same as environment, and it is extend with `src/config/default.js`. 

## Environments

### production mode

1. Start core serice script: `npm run prod_cluster`.

> Execute start service script except local env need install pm2 globally: `npm install pm2 -g`.

### development mode

* **startup services:**

1. Start core serice script: `npm run dev`.

* **show log scripts:**

```bash
pm2 logs --raw starterkit-api-dev | bunyan -L
```

### sit mode

* **startup services:**

1. Start core serice script: `npm run sit`.

* **show log scripts:**

```bash
pm2 logs --raw starterkit-api-sit | bunyan -L
```

### uat mode

* **startup services:**

1. Start core serice script: `npm run uat`.

* **show log scripts:**

```bash
pm2 logs --raw starterkit-api-uat | bunyan -L
```
