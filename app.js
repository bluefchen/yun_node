var express = require("express");
var app = express();
// var db = require("./models/db.js");
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//使用socket.io：
var http = require('http').Server(app);
 var io = require('socket.io')(http);

//使用session
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//控制器
var router = require("./controller");

//设置模板引擎
app.set("view engine", "ejs");

//路由中间件，静态页面
app.use(express.static("./public"));
app.use(express.static("./uploads"));

app.get("/", router.showIndex);                          //显示首页
// app.get("/showUrl", router.doshowUrl);                   //取出构件Url数据
app.post("/sendMsg", router.sendMsg);                  //发送短信
app.post("/submit", router.submit);                    //提交数据
app.post("/after_sales", router.after_sales);                    //handle after sale
app.post("/city_parter", router.city_parter);                    //handle city parter
// app.get("/doGetCamDate", router.doGetCamDate);           //取出Cam数据
// app.get("/login",router.showLogin);                      //显示登陆页面
// app.post("/doLogin",router.doLogin);                     //执行登录，Ajax服务
// app.get("/doLogout",router.doLogout);                    //执行注销，Ajax服务
// app.post("/postComponentInf", router.dopostComponentInf);//保存Component信息
// app.get("/getComponentInf", router.dogetComponentInf);   //读取Component信息
// app.post("/postUpdateComponentInf", router.dopostUpdateComponentInf);//更新Component信息
// app.post("/postVSG", router.postVSG);                    //保存VSG信息
// app.get("/getVSG", router.dogetVSG);                   //读取VSG信息



//404
app.use(function (req, res) {
    res.render("err");
});

http.listen(1235);
