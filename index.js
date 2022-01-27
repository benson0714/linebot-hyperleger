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
  let event = ctx.query;
  console.log(event);
  let rp_body = {
    replyToken: replyToken,
    messages: [{
            type: 'text',
            text: message
        },
        {
            type: 'text',
            text: replyToken
        }],
    };
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
ctx.body = rp(options)
.then((body) => {
    console.log('sucess');
})
.catch((err) => {
    console.log('err');
});

});

app.use(router.routes());  

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("App now running on port", port);
});
