
## Backend as a service(BaaS) platform for CRPower Legal app and website.

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

## Quick start

1. Clone this repo using `git clone http://10.59.6.208:9001/legal/crp-legal-api.git`
2. Run `npm install` to install dependencies.<br />
3. Run `npm start` to start service in local development mode.

## Configuration

We use [nconf](https://www.npmjs.com/package/nconf) to manage configuration between different environment, the configuration of current environment file name is just the same as environment, and it is extend with `src/config/default.json`. 

## Environments

### production mode

1. Start core serice script: `npm run prod_cluster`.
2. Start senc rooyee broadcast serice script: `npm run send_broadcast_prod`.
3. Start execute gokuai api serice script: `npm run exec_gokuai_api_prod`.
4. Start send broadcast for near case time service script: `npm run send_broadcast_near_case_time_prod`.

> Execute start service script except local env need install pm2 globally: `npm install pm2 -g`.

### development mode

* **startup services:**

1. Start core serice script: `npm run dev`.
2. Start senc rooyee broadcast serice script: `npm run send_broadcast_dev`.
3. Start execute gokuai api serice script: `npm run exec_gokuai_api_dev`.
4. Start send broadcast for near case time service script: `npm run send_broadcast_near_case_time_dev`.

* **show log scripts:**

```bash
pm2 logs --raw crp-legal-api-dev | bunyan -L
pm2 logs --raw crp-legal-send-broad-service-dev | bunyan -L
pm2 logs --raw crp-legal-exec-gokuai-api-service-dev | bunyan -L
pm2 logs --raw crp-legal-send-broadcast-near-case-time-service-dev | bunyan -L
```

### sit mode

* **startup services:**

1. Start core serice script: `npm run sit`.
2. Start senc rooyee broadcast serice script: `npm run send_broadcast_sit`.
3. Start execute gokuai api serice script: `npm run exec_gokuai_api_sit`.
4. Start send broadcast for near case time service script: `npm run send_broadcast_near_case_time_sit`.

* **show log scripts:**

```bash
pm2 logs --raw crp-legal-api-sit | bunyan -L
pm2 logs --raw crp-legal-send-broad-service-sit | bunyan -L
pm2 logs --raw crp-legal-exec-gokuai-api-service-sit | bunyan -L
pm2 logs --raw crp-legal-send-broadcast-near-case-time-service-sit | bunyan -L
```

### uat mode

* **startup services:**

1. Start core serice script: `npm run uat`.
2. Start senc rooyee broadcast serice script: `npm run send_broadcast_uat`.
3. Start execute gokuai api serice script: `npm run exec_gokuai_api_uat`.
4. Start send broadcast for near case time service script: `npm run send_broadcast_near_case_time_uat`.

* **show log scripts:**

```bash
pm2 logs --raw crp-legal-api-uat | bunyan -L
pm2 logs --raw crp-legal-send-broad-service-uat | bunyan -L
pm2 logs --raw crp-legal-exec-gokuai-api-service-uat | bunyan -L
pm2 logs --raw crp-legal-send-broadcast-near-case-time-service-uat | bunyan -L
```
