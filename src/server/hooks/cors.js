import convert from 'koa-convert'
import cors from 'koa-cors'

export default (app) => {
  app.use(convert(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  })))
}
