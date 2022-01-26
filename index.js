const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 4000;
app.use(logger());
app.use(bodyParser());

app.on('error', (err, ctx) => {
    console.log('server error', err, ctx)
});

app.use(router.routes());
app.use(router.allowedMethods());

let lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
router
    .get('/', (ctx, next) => {
        console.log(ctx);
        ctx.body = ctx;
    })
    .post('/webhook', async (ctx, next) => {
        var reply_Token = ctx.request.body.events[0].replyToken;
        console.log('token = ' , ctx.request.body.events[0].replyToken);

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
var rp = require('request-promise');
rp(options)
    .then(function (parsedBody){
        console.log('rq success');
    })
    .catch(function (err) {
        console.log('server error', err, ctx);
    });
});

app.listen(port);
module.exports = { app }