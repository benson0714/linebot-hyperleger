const koa = require('koa');
const Router = require('koa-router');
const rp = require('request-promise');
const check = require('./lib/check.js');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const replyMessage = require('./lib/example/replyMessage.js');
const hyperledger = require('./lib/example/hyperledger_api.js');
const app = new koa();
const router = Router();
const richMenu = require('./lib/example/richMenu.js');
const hyperledger_api = require('./lib/example/hyperledger_api.js');
const serve = require('koa-static');
const path = require('path')
const replyFlexMessage = require('./lib/requestServer/replyFlexMessage.js')
const replyPostback = require('./lib/replyRoot/replyPostMessage.js')
app.use(serve(path.join(__dirname, '/public')));

const channelSecret = process.env.LINE_CHANNEL_SECRET;
const lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const myLiffId = process.env.MY_LIFF_ID;

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
  .post('/', async (ctx) => {
    let events = ctx.request.body.events;
    console.log(`request = ${ctx.request}`);
    console.log(`body = ${ctx.request.body}`)
    let data = 'unsucess';
    if (events[0].message != undefined || events[0].message != null) {
      console.log(`typeof message = ${typeof (events[0].message)}`)
      data = await replyMessage.replyMessage(events, lineBotToken, {
        '哈囉': '你好阿',
        '晚安': '晚安',
        '終於': '做出來了',
        '您': '辛苦了',
      });
    } else {
      data = await replyPostback.replyPostback(events, lineBotToken);
      console.log('postback action done')
    }
    ctx.body = data;
  })
  .get('/create', async (ctx) => {
    // delete old rich menu
    let deleteRichMenu = await richMenu.deleteList(lineBotToken)
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
    console.log('GET listRichMenu request')
    let richMenuObj = await richMenu.listRichMenu(lineBotToken);
    ctx.body = richMenuObj;
  })
  //login to hyperledger_api and get the token
  .post('/login', async (ctx) => {
    userid = 'eric';
    password = 'pw$168';
    let login = await hyperledger.login(userid, password);
    let JWT_token = await login.response.token;
    console.log(`JWT_token = ${JWT_token}`);
    ctx.body = JWT_token;

  })
  .post('/trade', async (ctx) => {
    let postData = ctx.request.body;
    let transfer_token = await hyperledger_api.transfercode(JWT_token);
    transfer_token = transfer_token.response.token;
    console.log(transfer_token);
  })
  .post('/trade_history', async (ctx) => {

  })
  .get('/send-id', async (ctx) => {
    ctx.body = { id: myLiffId };
  })
  .get('/send-register', async (ctx) => {

  })
  .post('/flexMessage', async(ctx) => {
    // recieve userId from user
    userId = ctx.request.body.userId;
    // POST your flex message json to line server and send flex message to user
    let message = await replyFlexMessage.postFlexMessage(lineBotToken, userId);
    ctx.body = message;
  });


app.use(router.routes());

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("App now running on port", port);
});

