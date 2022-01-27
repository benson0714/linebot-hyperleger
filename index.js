const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
//使用.env檔的參數
const linebot = require('./lib/linebot.js');

const app = new koa();
const router = Router();
const channelSecret = process.env.LINE_CHANNEL_SECRET;
const lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

app.use(bodyParser());

router.post('/webhooks', async (ctx, next) => {
    let events = ctx.request.body.events;
    data = await responseText.responseText(events, lineBotToken, {
        '哈囉': '你好阿',
        '晚安': '晚安'
    });
    ctx.body = data;
});

app
    .use(linebot.middleware(channelSecret))
    .use(router.routes());

const server = app.listen(process.env.PORT || 8080, function () {
    const port = server.address().port;
    console.log("App now running on port", port);
});