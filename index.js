const koa = require('koa');
const Router = require('koa-router');
const check = require('./lib/check.js');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const replyMessage = require('./lib/example/replyMessage.js');
const app = new koa();
const router = Router();
const richMenu = require('./lib/example/richMenu.js');
const replyPostback = require('./lib/replyRoot/replyPostMessage.js');
const check_amount_func = require('./lib/hyperledgerAPI/check_amount_liff.js');
const check_address_func = require('./lib/hyperledgerAPI/check_address_liff.js');
const createDB = require("./lib/levelDB/createDB.js");
const stateError = require('./lib/ErrorHandle/stateError.js');

// 把全部html css等等的資料全部靜態匯入
const serve = require('koa-static');
const path = require('path');
const mount = require('koa-mount');

app.use(mount('/liff',serve(path.join(__dirname, '/liff/'))));

const channelSecret = process.env.LINE_CHANNEL_SECRET;
const lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const myLiffIdQrcode = process.env.MY_LIFF_ID_QRCODE;
const myLiffIdAmount = process.env.MY_LIFF_ID_AMOUNT;
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
    const clientIP = ctx.request.ip;
    console.log(`ip: ${clientIP}`);
    let events = ctx.request.body.events;
    console.log(`event type = ${events[0].type}`);
    console.log(`body = ${ctx.request.body}`)
    let data = 'unsucess';
    if (events[0].type === 'message') {
      console.log(`typeof message = ${typeof (events[0].message)}`)
      data = await replyMessage.replyMessage(events, lineBotToken, {
        '哈囉': '你好阿',
        '晚安': '晚安',
        '終於': '做出來了',
        '您': '辛苦了',
      });
    } else if(events[0].type === 'postback') { //偵測到postback action(richmenu的postback action)
      console.log('detect postback action');
      data = await replyPostback.replyPostback(events, lineBotToken);
      console.log('postback action done');
    }
    ctx.body = data;
  })
  .get('/', async (ctx) => {
    const clientIP = ctx.request.ip;
    console.log(`ip: ${clientIP}`);
    ctx.body = 'hello world';
  })
  .get('/create', async (ctx) => {
    console.log('create rich menu');
    // delete old rich menu
    let deleteRichMenu = await richMenu.deleteList(lineBotToken)
    //create rich menu
    let createDefaultRichMenu = await richMenu.createRichMenu(lineBotToken);
    let richMenuId = createDefaultRichMenu.richMenuId;
    console.log(richMenuId);
    // upload rich menu image
    let uploadRichMenuImageData = await richMenu.uploadRichMenuImage(richMenuId, `Benson.jpg`, lineBotToken);
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
  .get('/send-amount', async (ctx) => {
    ctx.body = { id: myLiffIdAmount };
  })
  .get('/send-qrcode', async (ctx) => {
    ctx.body = {id: myLiffIdQrcode};
  })
  .post('/check_address', async (ctx) => {
    const data = ctx.request.body;
    console.log(data);
    console.log(`amount = ${data.amount}`);
    console.log(`test console.log`);
    const amount = data.amount;
    const tokenId = data.tokenId;
    const userId = data.userId;
    const address = data.qrcode_address;
    const time = data.time;
    check_address_func.check_address(userId, lineBotToken, amount, tokenId, address, time);
    ctx.body = {
      amount: data.amount
    }
  })
  .post('/check_amount', async (ctx) => {
    const data = ctx.request.body;
    console.log(data);
    console.log(`amount = ${data.input_amount}`);
    console.log(`test console.log`);
    const amount = data.input_amount;
    const tokenId = data.tokenId;
    const userId = data.userId;
    const currentState = data.currentState;
    const state = data.state;
    await check_amount_func.check_amount(userId, lineBotToken, amount, tokenId);
    ctx.body = {
      amount: data.input_amount
    }
  })
  .post('/createDB', async (ctx)=>{
    const data = ctx.request.body;
    const userId = data.userId;

    const temp = await createDB.createDB(userId);
    console.log(temp);
    const jwtToken = temp[0];
    const state = temp[1];
    console.log(`jwt token in index.js${jwtToken}`);
    ctx.body={
      jwtToken:jwtToken,
      state: state
    }
  })
  .post('/errorStateHandle', async (ctx)=>{
    const data = ctx.request.body;
    const userId = data.userId;
    const state = data.state; // 目前已經執行到的state
    const currentState = data.currentState; // 錯誤執行的state
    stateError.stateError(userId, lineBotToken, state, currentState);
  });

app.use(router.routes());

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("App now running on port", port);
});

