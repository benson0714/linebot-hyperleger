const koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const request = require('request-promise');
const logger = require('koa-logger')
global.crypto = require('crypto');

const app = new koa();
const router = Router();

let lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const channelSecret = process.env.LINE_CHANNEL_SECRET;
app.use(async (ctx, next) => {
  const koaRequest = ctx.request;
  const hash = crypto
    .createHmac('sha256', channelSecret)
    .update(JSON.stringify(koaRequest.body))
    .digest('base64');
  if (ctx.url == '/webhooks' && ctx.method == 'POST') {
    if (koaRequest.headers['x-line-signature'] === hash) {
      // User 送來的訊息
      ctx.status = 200;
    } else {
      ctx.body = 'Unauthorized! Channel Serect and Request header aren\'t the same.';
      ctx.status = 401;
    }
  }
  await next();
});
app.use(bodyParser());
app.use(logger());

app.use(router.routes());
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log("App now running on port", port);
});