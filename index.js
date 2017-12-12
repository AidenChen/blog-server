const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'test';
});

app.listen(3000);
