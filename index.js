const koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const request = require('request-promise');
const logger = require('koa-logger')

const app = new koa();
const router = Router();

let lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

app.use(bodyParser());
app.use(logger());

router
  .post('/webhooks', async (ctx, next) => {
    let replyToken = ctx.request.body.events[0].replyToken;
    console.log('token = ', ctx.request.body.events[0].replyToken)
});

var rp_body = ({
  replyToken: reply_Token,
  messages: [{
          type: 'text',
          text: 'Hello'
      },
      {
          type: 'text',
          text: 'How are you?'
      }]
  });

var options = {
  method: 'POST',
  url: 'https://api.line.me/v2/bot/message/reply',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lineBotToken}`
  },
  json: true,
  body: rp_body
};

request(options)
  .then((parsedBody) => {
    console.log('rp sucess');
  })
  .catch((err) => {
    console.log('server error', err, ctx);
  })

app.use(router.routes());
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log("App now running on port", port);
});