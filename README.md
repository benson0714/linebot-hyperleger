# linebot-hyperleger
# heroku
### line developer + heroku可參考此篇!!!
https://medium.com/rd-tw/node-heroku-%E6%89%93%E9%80%A0-line-%E8%81%8A%E5%A4%A9%E6%A9%9F%E5%99%A8%E4%BA%BA-d81fe6dba1f
## Create job

### 1. Create line account

#### Choose Messaging API
![](https://i.imgur.com/ygp52Bb.png)

### 2. Download heroku

#### 下載並安裝好後透過terminal輸入heroku login並在瀏覽器上點選login
![](https://i.imgur.com/cUy7oZk.png)

### 3. 初始化

#### 3.1 npm init會產生package.json檔
```shell=
$ mkdir chatbot // 在當前路徑下建立 chatbot 資料夾
$ cd chatbot    // 切換到 chatbox 資料夾下
$ git init      // 初始化 git
$ npm init      // 初始化 npm，基本上先全部 enter 就行
```
#### 3.2 修改package.json，部署到 Heroku 時它預設會執行 npm start，這時候他會去跑 package.json 內的 scripts，並找到 start 這個 key 所代表的指令，我們剛剛修改後，也就是 node .
```javascript=
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
}
改成
"scripts": {
  "start": "node ."
}
```
![](https://i.imgur.com/QNT842g.png)


#### 3.3 新增一個 .gitignore 檔案，用意是不要把 node_modules 或一些不需要上傳的檔案一起被加到 git 內，在伺服器上執行 npm start 它會自己根據 package.json 去下載。

![](https://i.imgur.com/fToemFd.png)
#### 3.4 新增一個 index.js，這個名稱跟 package.json 內的 main 一致，這個是程式進入點。
```javascript=
// 引用 line bot SDK
let linebot = require('linebot');

// 初始化 line bot 需要的資訊，在 Heroku 上的設定的 Config Vars
let bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

// 當有人傳送訊息給 Bot 時
bot.on('message', function (event) {
  // 回覆訊息給使用者 (一問一答所以是回覆不是推送)
  event.reply(`你說了 ${event.message.text}`);
});

// Bot 所監聽的 webhook 路徑與 port，heroku 會動態存取 port 所以不能用固定的 port，沒有的話用預設的 port 5000
bot.listen('/', process.env.PORT || 5000, function () {
  console.log('全國首家LINE線上機器人上線啦！！');
});
```
#### 3.5 匯入linbot sdk
```shell=
$ npm install linebot --save
```

#### 3.6 匯入後要有的檔案
![](https://i.imgur.com/hliLSsT.png)

### 4. 部屬到heroku上
#### 4.1 git 上傳
```shell=
$ git add . // 把所有新增的檔案都加入到 git 內追蹤
$ git commit -m 'First Commit' // 提交變更過的程式碼並加上備註
$ git push heroku master // 把程式碼同步到遠端 Heroku 上
```
#### 4.2 git add . 上傳畫面 & git commit並輸入更改內容
![](https://i.imgur.com/kK8DrpK.png)

#### 4.3 push到heroku的github上
![](https://i.imgur.com/huMaElE.png)


## 補充
### Heroku官網上可執行操作
#### 可查到擁有的專案
![](https://i.imgur.com/cAfVC4S.png)

#### Overview可看曾經做過的事
![](https://i.imgur.com/b6lHetC.png)

#### 將專案clone下來並確認有.git檔
![](https://i.imgur.com/6zxPFVk.png)

### remote
可以讓heroku remote要操作的專案
```shell=
heroku git:remote -a line-sdk-test
```

---
title: 'linebot程式撰寫'
---

LineBot程式撰寫
===

## Table of Contents

[TOC]

## 1. 前置處理
---
### 1.1 加入使用到的sdk
有用到甚麼套件就都install
terminal:
```shell=
npm install koa --save
npm install koa-router --save
npm install request-promise --save
...
```
javascript:
將套件require進來
```javascript=
const koa = require('koa');
const Router = require('koa-router');
const rp = require('request-promise');
const check = require('./lib/check.js');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

const app = new koa();
const router = Router();
const richMenu = require('./lib/example/richMenu.js');
```


### 1.2 LineBotToken
要和line webwooks去溝通要透過token，這邊.env檔是在heroku上預先填好，當將程式碼上傳後heroku會自動新增.env檔裡面
#### heroku 設定
![](https://i.imgur.com/4GdnLZT.png)

#### javascript:
```javascript=
const channelSecret = process.env.LINE_CHANNEL_SECRET;
const lineBotToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
```

### 1.3 koa & koa-router
koa framework : https://koajs.com/# ，所有的api都可以在裡面查詢
這邊值得注意的是要取得body的資料一定要使用bodyParser!!!
```javascript=
const app = new koa();
const router = Router();

app.use(bodyParser());
app.use(logger());
```
---

## 2. heroku POST/GET

### 2.1 簡介
#### 首先要先了解流程
herku server在這邊是利用koa來架設，所以概念為heroku server收到POST/GET後，執行後續動作
--> router.post or router.get 可以接收POST or GET
![](https://i.imgur.com/SVUa5mo.png)

### 2.2 javascript
---
#### app.use
當有人POST/GET時可以做一些動作
```javascript=
app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(ctx.method);
  await next();
  });
```
這邊先檢查有沒有被竄改過，順便學一下如何將middleware這個function給其他檔案使用 : 
```javascript = 
module.exports = {middleware:middleware}
```
外面可以用以下來呼叫
```javascript=
const check = require('./lib/check.js');
```
完整檢查程式碼
```javascript=
const crypto = require('crypto');

const middleware = function (channelSecret) {
  /*
    line bot middleware 處理
    過慮訊息是否由line developers發出請求
    ctx.url = '/'
    ctx.method=='POST'
    result =>
      true ctx.status = 200
      false ctx.ststus = 401
  */
  return async (ctx, next) => {
    const koaRequest = ctx.request;
    const hash = crypto
      .createHmac('sha256', channelSecret)
      .update(JSON.stringify(koaRequest.body))
      .digest('base64');
    if (ctx.url == '/' && ctx.method == 'POST') {
      if (koaRequest.headers['x-line-signature'] === hash) {
        // User 送來的訊息
        ctx.status = 200;
      } else {
        ctx.body = 'Unauthorized! Channel Serect and Request header aren\'t the same.';
        ctx.status = 401;
      }
    }
    await next();
  }
};

module.exports = { middleware: middleware };
```
---

#### router.post / router.get
router.post為當收到POST時執行的動作，router.get為當收到GET時執行的動作。

下面為訊息回傳的程式碼，需要注意的是這邊的寫法是全部寫在同一個檔案裏面，真正在寫的時候應該要分開檔案比較容易修改，且我這邊直接將ctx.status設200，因為只是測試用!!!
```javascript=
router
    .post('/', async(ctx) => {
          ctx.body="Hello";
          ctx.status = 200;
          let event = ctx.request.body;
          console.log(event.events[0].replyToken);
          console.log(event.events[0].message.text);
          replyToken = event.events[0].replyToken;
          message = event.events[0].message.text;

          let rp_body = {
            replyToken: replyToken,
            messages: [{
                    type: 'text',
                    text: message
                },
                {
                    type: 'text',
                    text: 'How are you?'
                }]
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
          // use request-promise
          ctx.body = rp(options)
          .then((body) => {
              console.log('sucess');
          })
          .catch((err) => {
              console.log('err');
          });

    })
```

## 補充
### Debug 超好用:
使用koa-logger + heroku logs --tail
koa-logger可以將POST/GET等狀態列出來
heroku logs --tail 輸入在cmd可以持續查看目前server的狀態
![](https://i.imgur.com/wzC20kr.png)

### ctx.request.body + koa-logger
這兩個加起來可以先看body裡有甚麼東西，以replyMessage來說，當收到line server傳給我的POST時，我不知道message要如何取得，所以我就先去查ctx.request.body裡面有甚麼，




### 2.2 變數宣告
#### let
```javascript=
#宣告temperature為30

let temperature;
temperature = 30;
console.log(temperature)
```

#### const
```javascript=
#使用const來宣告constant( 常數變數)

const daysInWeek = 7;
console.log(dayInWeek)
```
### 2.3 變數規範
1. 文字轉數字是合法的
```javascript=
let message = 10;
message = "Welcome Guestg"
```

### 2.4 數值( number)
1. number介於-9007199254740991~9007199254740991，如果超出範圍要使用bigint，且如果超出範圍javascript不會報錯。

2. bigint
在數字尾加一個n
```javascript=
let bigNumber = 999999999999999999n;
console.log(bigNumber);
```
### 2.5 string
1. 雙引號
2. 單引號
3. 反引號
```javascript=
let message1 = "Message 1";
let message2 = 'Message 2';
let message3 = `Message 3`;
```
4. 僅有反引號能在string內使用${}印變數
```javascript=
let message = "10";
console.log(`message = ${message}`);
```
5. 串接字串可以使用+
```javascript=
let message = "10";
console.log(`message = ` + message);
```

### 2.6 boolean
```javascript=
let isDone = true;
isDone = false;
```

### 2.7 null
```javascript=
let age = null;
```

### 2.8 undefine
```javascript=
let roomNumber;
console.log(roomNumber);
```

### 2.9 Symbol
```javascript=
let id = Symbol();
```

### 2.10 object
```javascript=
let user = {
    name: "John",
    age: 18,
};
```
### 2.11 整理 : 變數命名限制及特殊用法
1. 可以包含: 字母、數字、$、 _ ( :+1:benson0714 $$)
3. 首字符不能是數字 ( :-1:0714benson)
4. 首字有分大小寫
5. 一個變數可以文字轉數字( eg. 2.3變數規範)
6. 僅有`反引號`能在string內使用${}印變數
7. null != undefine
Project Timeline
---

## 3. 算術運算
1. 有+ - * / % **
**是冪次方

```javascript=
# ++balance和balance++是不一樣的\

let balance = 0;
++balance;
balance++;
```

加加在前面的為前置遞增( pre-increment)
加加在後面的為後置遞增( post-increment)

差別在於 : 
```javascript=
let balance = 0;
let newValue = balance++
# balance++是先將newValue = balance再將balance+1，所以newValue = 0, balance=1
```

```javascript=
let balance = 0;
let newValue = ++balance
# balance++是先將balance=balance+1，再將newValue = balance，所以newValue = 1, balance=1
```
## 4. 比較
!= == <= >= < > === !==
1. 只要是三個符號就是嚴格比較( strict comparison)(數值及型態都要一樣)
2. string比較會自動轉為數字比較(a=97)

```javascript=
console.log('a'<'b');
# 答案為true，a=97，b=98
console.log('a'.charCodeAt(0));
# 答案為97
```

## 5. if, else if, else, &&, ||
```javascript=
let a=false
let b=0
if(a===true){
    b++;
}else if(a===5){
    b++;
}else{
    b=10;
}
```
上面程式碼等於:
```javascript=
let a=false
let b=0
if(a===true || a===5){
    b++;
}else{
    b=10;
}
```

## 6. 迴圈
### 6.1 for loop迴圈 & break
```javascript=
for (let i = 1; i <= 5; i++) {
    console.log(`your number is ${i}`);
    if (i === 3) {
        break;
    }
}
```
![](https://i.imgur.com/qI6hyGT.png)


### 6.2 continue
```javascript=
for (let i = 1; i <= 5; i++) {
    if (i === 2 || i === 3) {
        continue;
    }
    console.log(`your number is ${i}`);
}
```
![](https://i.imgur.com/CuOt5BN.png)

### 6.3 while loop
```javascript=
let i = 1;

while (i <= 5) {
    console.log(i);
    i++;
}
```
![](https://i.imgur.com/tCBogMH.png)

### 6.4 do while loop
```javascript=
let i = 1
do {
    console.log(i);
    i++;
} while(i <= 5);
```
![](https://i.imgur.com/hcUXFpG.png)

### 6.5 小結 
1. while loop 比 for loop更靈活，不須先定義要執行次數
2. 要注意while loop容易造成無限循環

## 7. Array
### 7.1 基本宣告
```javascript=
let fruits = ["Apple", "Banana", "Orange"];
console.log(fruits);
console.log(fruits.length);
console.log(fruits[0]);
```
![](https://i.imgur.com/hqPArXm.png)

### 7.2 add elements
#### 尾部添加(push)
```javascript=
let fruits = ["Apple", "Banana", "Orange"];
fruits.push("Mango");
console.log(fruits);
```
![](https://i.imgur.com/vWu6uOk.png)

#### 頭部添加(unshift)
```javascript=
let fruits = ["Apple", "Banana", "Orange"];
fruits.unshift("Mango");
console.log(fruits);
```
![](https://i.imgur.com/euB6KPc.png)

### 7.3 delete elements
#### 尾部刪除(pop)
```javascript=
let fruits = ["Apple", "Banana", "Orange"];
fruits.pop();
console.log(fruits);
```
![](https://i.imgur.com/prJhJ4P.png)

#### 頭部刪除(shift)
```javascript=
let fruits = ["Apple", "Banana", "Orange"];
fruits.shift();
console.log(fruits);
```
![](https://i.imgur.com/gffiHaq.png)

### 7.4 讀取array
```javascript=
let sales = [100, 20, 30, 60, 200, 30, 95];
let totalSales = 0;
for (let i = 0; i < sales.length; i++){
    totalSales += sales[i];
}
console.log(`totalSales = ${totalSales}`);
```
![](https://i.imgur.com/C4XpF7U.png)

### 7.5 小節
1. 使用unshift時需要移動整個array來將element加到第一個
2. 使用shift時需要移動整個array來刪第一個element

## 8. function
### 8.1 創建function
```javascript=
function showMessage(){
    console.log(`Hi, I am Benson`);
}
showMessage();
```
![](https://i.imgur.com/WXZhVtN.png)

### 8.2 帶parameters
#### 正常使用
```javascript=
function showMessage(username){
    console.log(`Hi, I am ${username}`);
}
showMessage("Benson");
```
![](https://i.imgur.com/WXZhVtN.png)

#### 預設parameter
本該帶參數卻沒帶， 就會輸入預設parameter
```javascript=
function showMessage(username = "Allen"){
    console.log(`Hi, I am ${username}`);
}
showMessage();
```
![](https://i.imgur.com/pAUdbWw.png)

### 8.3 return 回傳
```javascript=
function sum(num1, num2) {
    let total = num1 + num2;
    return total;
}

let s = sum(2, 8);
console.log(s)
```
![](https://i.imgur.com/dWD6QuX.png)

## 9. HTML 串接 javascript(button)
### 9.1 將js寫在html裡面
```javascript=
<html>
    <head>
    </head>
    <body>
        <button onclick="alert('Hey there!')">Click me!</button>
    </body>
    <script src = "hello.js" charset = "UTF-8"></script>
</html>
```
![](https://i.imgur.com/KbQ3QbJ.png)
點擊按鈕->觸發事件->捕獲事件->處理事件

### 9.2 將js分開，但html內還是有onclick
![](https://i.imgur.com/zqj15mA.png)
### 9.3 完全分開(DOM)
html :
```htmlembedded=
<html>
    <head>
    </head>
    <body>
        <button id = "myButton">Click me!</button>
    </body>
    <script src = "hello.js" charset = "UTF-8"></script>
</html>
```
javascript :
```javascript=
function showAlert() {
    alert("hey function!");
}

let btn = document.getElementById("myButton")
btn.onclick = showAlert;
```
注意 : showAlert不用加()，因為沒有要執行，加了會變成馬上執行。

問題 : 不能同讓一個按鈕同時處理多個事件
![](https://i.imgur.com/m5f0wul.png)
結果為:
![](https://i.imgur.com/YSomXnN.png)

### 9.4 addEventListener
可以解決上述問題
html : 
```htmlembedded=
<html>
    <head>
    </head>
    <body>
        <button id = "myButton">Click me!</button>
    </body>
    <script src = "hello.js" charset = "UTF-8"></script>
</html>
```

javascript : 
```javascript=
function showAlert() {
    alert("hey function!");
}

function secondFunction() {
    alert("hey second function!");
}
let btn = document.getElementById("myButton");
btn.addEventListener("click", showAlert);
btn.addEventListener("click", secondFunction);
```
secondFunction會接著showAlert彈出

5. removeEventListener
```javascript=
btn.removeEventListener("click", showAlert);
```

### 9.5 event object
可以透過event object來得知滑鼠點擊的座標
```javascript=
function showAlert(event) {
    alert("hey function!");
    alert(`Coordinate: ${event.clientX} - 
    ${event.clientY}`);
    console.log(event);
}
let btn = document.getElementById("myButton");
btn.addEventListener("click", showAlert);
```
![](https://i.imgur.com/g0mKzUx.png)
![](https://i.imgur.com/ur8kZz2.png)

## 10. Callback function
### 10.1 發展史
Callback -> Promise -> Async/Await
### 10.2 概念
#### Synchronous execution
一個任務接一個任務執行
```javascript=
console.log('Hello');
console.log('world');
```
結果會是 Hello world
#### Asynchronous execution
目的 : 不讓耗時的任務卡在前面(eg.下載一個1G的圖片才能接續工作。
程式編輯的順序不是執行的順序，可以利用callback達成。

### 10.3 使用方法
將函示要輸入的parameter輸入function
```javascript=
function show2(){
    console.log(2);
}
console.log(1);
setTimeout(show2, 3000);
console.log(3);
```
![](https://i.imgur.com/NjR4llK.png)
執行邏輯 : 
1. 先印出1
2. 接著執行setTimeout(), 程式部會在這慢慢等三秒再接續執行，會先將show2丟到callback queue內等待setTimeout()執行完再取出
3. 程式印出3
4. setTimeout()執行完，所以將show2取出，印出2

## 11. Promise
### 11.1 出現目的
1. callback容易形成callback hell( a function執行b function, b function執行c function)
2. 讓程式人員容易維護
3. 分為三種狀態
![](https://i.imgur.com/yfDJG30.png)


### 11.2 實作
promise提供resolve, reject函式
```javascript=
let sentToAirport = false;
let p = new Promise(function(resolve, reject) {
    if (sentToAirport) {
        resolve("from resolve(): send to airport");
    } else{
        reject("from reject(): order cancelled");
    }
});

p
.then(function(message) { console.log(`${message}- promise resolved`)})
.catch(function(message) { console.log(`${message}- promise reject`)});
```

### fetch()
fetch回傳是promise
```javascript=
let f = fetch("https://jsonplaceholder.typicode.com/users");
f
.then(function(userData) {
    return userData.json();
})
.then(function(jsonData) {
    console.log(jsonData);
});

```

## Async/Await

### 實作
``` javascript=
function sendRequest() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject("Request rejected due to server error")
        }, 2000);
    });
}

async function getUsername(){
    try{
        let username = await sendRequest();
        console.log(username);   
    }catch (message) {
        console.log(`Error : ${message}`)
    }
}

getUsername();
```

### fetch
```javascript=
async function getUsername(){
    try{
        let username = await fetch("https://jsonplaceholder.typicode.com/users");
        username = await username.json();
        console.log(username);   
    }catch (message) {
        console.log(`Error : ${message}`)
    }
}

getUsername();
```
:::info
**Find this document incomplete?** Leave a comment!
:::

###### tags: `Templates` `Documentation`



    
