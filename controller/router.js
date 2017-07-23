/**
 * Created by Danny on 2015/9/22 15:30.
 */
var file = require("../models/file.js");
// var db = require("../models/db.js");
var formidable = require('formidable');
var path = require("path");
var fs = require("fs");
var md5 = require("../models/md5.js");
var sd = require("silly-datetime");

//Websocket
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PythonShell = require('python-shell');


var args_randoms;

//首页
exports.showIndex = function(req,res,next){

    res.redirect('index.html');
};


//发送手机短信
exports.sendMsg = function(req,res,next){

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        phone = fields.phone;
        console.log(phone);

        args_randoms = Math.floor(Math.random()*10+1)*1000;
        PythonShell.run('./controller/ali.py', {
            args: [phone, args_randoms]
        },function (err,res) {
            console.log(res);
            if (err) throw err;
            console.log('finished');
        })
    });
    var str='{"res":false,"randnum":8502}';
    res.json(str);
    res.end();
};

//Post 提交数据
exports.submit = function(req,res,next){

    var form = new formidable.IncomingForm();
    form.maxFields = 10000000;//设置fields中储存的最大json个数
    form.parse(req, function (err, fields, files) {
        var fieldsDate =  new function(){
            this.vsgName = fields.vsgName;
            this.act = fields.act;
            this.from = fields.from;
            this.y_address = fields.y_address;
            this.tel = fields.tel;
            this.data_mobile = fields.data_mobile;
            this.message = fields.message;
            this.company = fields.company;
            this.company_name = fields.company_name;
            this.from_ad = fields.from_ad;
            this.game_goods_id = fields.game_goods_id;
            this.time = fields.time;
            this.orderline_codetype = fields.orderline_codetype;
            this.city_address = fields.city_address;
            this.district_id = fields.district_id;
            this.code = fields.code;
            this.jingpian_price = fields.jingpian_price;
            this.referer = fields.referer;
            this.serivce_type = fields.serivce_type;
        };
        var usefulFieldsDate =  new function(){
            this.y_address = fields.y_address;
            this.tel = fields.tel;
            this.time = fields.time;
            this.city_address = fields.city_address;
            this.code = fields.code;
            this.serivce_type = fields.serivce_type;
        };
        if(usefulFieldsDate.code != args_randoms){
            console.log(usefulFieldsDate.code +"code erro"+args_randoms);
            var str='{"check_code_result":2}';
            res.json(str);
            res.end();
        }else {
            console.log(usefulFieldsDate.code +"code right"+args_randoms);
            var str='{"res":2}';
            res.json(str);
            res.end();

        }
    });
};

//city parter
exports.city_parter = function(req,res,next){

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var usefulFieldsDate =  new function(){
            this.name = fields.name;
            this.idNum = fields.idNum;
            this.city_address = fields.city_address;
            this.sex = fields.sex;
            this.runCity = fields.runCity;
            this.experience = fields.experience;
            this.address = fields.address;
            this.tel = fields.tel;
            this.code = fields.code;
        };
        console.log(usefulFieldsDate.tel,usefulFieldsDate);
        if(usefulFieldsDate.code != args_randoms){
            console.log(usefulFieldsDate.code +"code erro"+args_randoms);
            var str='{"res":3}';
            res.json(str);
            res.end();
        }else {
            console.log(usefulFieldsDate.code +"code right"+args_randoms);
            var str='{"res":1}';
            res.json(str);
            res.end();

        }
    });
};

//after_sales
exports.after_sales = function(req,res,next){

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var usefulFieldsDate =  new function(){
            this.consignee = fields.consignee;
            this.address = fields.address;
            this.reason_a = fields.reason_a;
            this.tel = fields.tel;
            this.code = fields.code;
        };
        console.log(usefulFieldsDate.tel,usefulFieldsDate);
        if(usefulFieldsDate.code != args_randoms){
            console.log(usefulFieldsDate.code +"code erro"+args_randoms);
            var str='{"res":3}';
            res.json(str);
            res.end();
        }else {
            console.log(usefulFieldsDate.code +"code right"+args_randoms);
            var str='{"res":1}';
            res.json(str);
            res.end();

        }
    });
};