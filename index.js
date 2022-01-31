const koa = require('koa');
const Router = require('koa-router');
const rp = require('request-promise');
const check = require('./lib/check.js');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const replyMessage= require('./lib/example/replyMessage.js');
const hyperledger = require('./lib/example/hyperledger_api.js');
const app = new koa();
const router = Router();
const richMenu = require('./lib/example/richMenu.js');

const channelSecret = process.env.LINE_CHANNEL_SECRET;
const lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
// use body parser to check ctx.request.body
app.use(bodyParser());
app.use(logger());

// do something when someone POST/GET this server
app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(ctx.method);
  await next();
  });
app.use(check.middleware(channelSecret));
router
.post('/', async(ctx) => {
  let events = ctx.request.body.events;
  let data = await replyMessage.replyMessage(events, lineBotToken, {
    '哈囉': '你好阿',
    '晚安': '晚安',
    '終於': '做出來了',
    '您' : '辛苦了',
    '詠章' : '好帥'
});
ctx.body = data;
})
.get('/create', async (ctx) => {
  //create rich menu
  let createDefaultRichMenu = await richMenu.createRichMenu(lineBotToken);
  let richMenuId = createDefaultRichMenu.richMenuId;
  console.log(richMenuId);
  // upload rich menu image
  let uploadRichMenuImageData = await richMenu.uploadRichMenuImage(richMenuId, `coffee.jpg`, lineBotToken);
  console.log(uploadRichMenuImageData);
  // Set default rich menu
  let setDefaultRichMenuData = await richMenu.setDefaultRichMenu(richMenuId, lineBotToken);
  ctx.body = setDefaultRichMenuData;
})
.get('/listRichMenu', async (ctx) => {
  console.log('11111111')
  let richMenuObj = await richMenu.listRichMenu(lineBotToken);
  ctx.body = richMenuObj;
})
.post('/login', async(ctx) => {
  userid = 'mary';
  password = '0000';
  let login = await hyperledger.login(userid, password);
  console.log(login);
  console.log(typeof(login))
  let JWT_token = await login.response.token;
  console.log(`JWT_token = ${JWT_token}`);
  ctx.body = login;
})
.post('/trade_history', async(ctx) => {

})
.post('/trade', async(ctx) => {

});

app.use(router.routes());  

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("App now running on port", port);
});

