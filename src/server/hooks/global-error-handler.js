import onerror from 'koa-onerror'

export default (app) => {
  onerror(app, {
    all(err, ctx) {
      ctx.body = JSON.stringify({
        status: err.status || 500,
        error: err.message,
        stack: err.stack
      })
    }
  })
}
