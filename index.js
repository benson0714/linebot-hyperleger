const koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const rp = require('request-promise');
const logger = require('koa-logger')

const app = new koa();
const router = Router();

let lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

app.use(bodyParser());
app.use(logger());

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
});

app.use(router.allowedMethods());

router
.get('/', (ctx, next) => {
  console.log(ctx);
  ctx.body = ctx;
})
  .post('/webhooks', async (ctx, next) => {
    let reply_token = ctx.request.body.events[0].replyToken;
    console.log('token = ', ctx.request.body.events[0].replyToken);

let rp_body = ({
  replyToken: reply_token,
  messages: [{
          type: 'text',
          text: 'Hello'
      },
      {
          type: 'text',
          text: 'How are you?'
      }]
  });

let options = {
  method: 'POST',
  url: 'https://api.line.me/v2/bot/message/reply',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lineBotToken}`
  },
  json: true,
  body: rp_body
};

rp(options)
  .then((parsedBody) => {
    console.log('rp sucess');
  })
  .catch((err) => {
    console.log('server error', err, ctx);
  });
});

app.use(router.routes());
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log("App now running on port", port);
});