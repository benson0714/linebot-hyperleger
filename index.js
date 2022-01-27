const koa = require('koa');
const Router = require('koa-router');
const rp = require('request-promise');

const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

const app = new koa();
const router = Router();

const channelSecret = process.env.LINE_CHANNEL_SECRET;
const lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

app.use(logger());
app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(ctx.method);

  await next();
  });
router
.post('/', async(ctx) => {
  let event = ctx.request.body;
  console.log(event);
  console.log(ctx.url);
  console.log(ctx.message);
  console.log(`header${ctx.request.header}`);
  console.log(`herf${ctx.href}`);
  
})
.post('/webhooks', async(ctx) => {
  let event = ctx.body;
  console.log(event);
  console.log(`webhook${ctx.url}`);
  console.log(ctx.message);
});

app.use(router.routes());  

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("App now running on port", port);
});
