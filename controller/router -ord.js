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


//首页
exports.showIndex = function(req,res,next){
    //必须保证登陆
  /*  if (req.session.login != "1") {
        res.render("login", {});
        console.log("Forbidden Entrance!!!");
        return;
    }*/
    //    res.sendfile("./public/Shougang.ejs");

    //检索数据库，查找此人的头像
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }
    //已经登陆了，那么就要检索数据库，查登陆这个人的头像
    db.find("users", {username: username}, function (err, result) {

        res.render("Shougang", {
            "login": login,
            "username": username
        });
    });
};

//根据文件名，下载对应的文件
exports.doshowUrl = function(req,res,next){

        var fileName = req.query.fileName;
        console.log(fileName);
        db.find("urls",{"fileName":fileName}, function (err,result){
                    if(err || result.length == 0){
                            res.json("");
                            console.log("失败");
                            return;
                    }
        // console.log(result);
      //  var filePath = {"url":result[0].filePath};
        var filePath1 = result[0].filePath;
        //巨大的坑,fs模块要引用绝对路径！用resolve转换；http://blog.csdn.net/u012193330/article/details/51323586此文有介绍。
            var filePath =path.resolve(__dirname+"/../public/js",filePath1);
        //    console.log(filePath);

        //    console.log(__dirname);

            // res.json(filePath);

            fs.stat( filePath , function ( err , stat ){
                if (err) {
                    if ('ENOENT' == err.code) {
                        console.log( 'File does not exist...' );
                        res.end( 'File does not exist...' );
                    } else {
                        console.log( 'Read file exception...' );
                        res.end( 'Read file exception...' );
                    }
                } else {
                    file_stream = fs.createReadStream( filePath );
                    file_stream.on( 'data' , function( chunk ){
                        res.write( chunk );
                    } );
                    file_stream.on( 'end' , function(  ){
                        res.end( "" );
                    //    console.log( "文件读取完毕" );
                    } );
                    file_stream.on('erro2475' +
                        'r', function(err){
                        res.end( "文件读取失败！" );
                    });
                }//end else,读取文件没有发生错误
            });

        //    res.json(filePath);

        })
};

//通过请求文件名，将文件的路径写入数据库
exports.sendMsg = function(req,res,next){

        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
                var phone = fields.phone;
                console.log(phone);




        });
};

//Post当前摄像机信息
exports.doPostCamDate = function(req,res,next){

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

/*
        var Vector3 = new function ( x, y, z ) {

            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;

        };*/

        var camera = new function(){
            this.cameraX = null;
            this.cameraY = null;
            this.cameraZ = null;
            this.cameraTargetX = 0;
            this.cameraTargetY = 0;
            this.cameraTargetZ = 0;

        };
        camera.cameraX = fields.cameraX;
        camera.cameraY = fields.cameraY;
        camera.cameraZ = fields.cameraZ;
        camera.cameraTargetX = fields.cameraTargetX ;
        camera.cameraTargetY = fields.cameraTargetY ;
        camera.cameraTargetZ = fields.cameraTargetZ ;

        //查询数据库中是不是已写入此数据

        db.find("CamDate", {"cameraX": camera.cameraX,
                            "cameraY" : camera.cameraY,
                            "cameraZ" : camera.cameraZ,
                            "cameraTargetX" : camera.cameraTargetX,
                            "cameraTargetY" : camera.cameraTargetY,
                            "cameraTargetZ" : camera.cameraTargetZ,
                            "username":req.session.username
            }
            , function (err, result) {
                console.log(result,{"cameraX": camera.cameraX,
                    "cameraY" : camera.cameraY,
                    "cameraZ" : camera.cameraZ,
                    "cameraTargetX" : camera.cameraTargetX,
                    "cameraTargetY" : camera.cameraTargetY,
                    "cameraTargetZ" : camera.cameraTargetZ,
                    "username":req.session.username
                });
            if (err) {
                res.send("-3"); //服务器错误
                return;
            }
            if (result.length != 0) {
                res.send("已存在"); //已存在
                return;
            }


                db.insertOne("CamDate",{
                "cameraX" : camera.cameraX,
                "cameraY" : camera.cameraY,
                "cameraZ" : camera.cameraZ,
                "cameraTargetX" : camera.cameraTargetX,
                "cameraTargetY" : camera.cameraTargetY,
                "cameraTargetZ" : camera.cameraTargetZ,
                "username":req.session.username

            }, function (err, result) {
                if (err) {
                    res.send("-3"); //数据库错误
                    return;
                }
                res.send("ok"); //数据库写入成功
            });

        });
    });
};

//发送最后一条摄像机位置
exports.doGetCamDate = function (req, res, next) {
    db.find("CamDate", {"username":req.session.username}, function (err, result) {
        if (err || result.length == 0) {
            res.json("");
            console.log("失败");
            return;
        }
        console.log(result[result.length-1]);
        res.send( result[result.length-1]);
    })
};

//显示登陆页面
exports.showLogin = function (req, res, next) {
    res.render("login", {});
};

//登陆页面的执行
exports.doLogin = function (req, res, next) {
    //得到用户表单
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单之后做的事情
        var username = fields.username;
        var password = fields.password;
        var remeber_login = fields.remeber_login;

        var encrypted_passwords = md5(md5(password) + "首钢");
       // encrypted_passwords = password;
        //查询数据库，看看有没有个这个人
        db.find("users", {"username": username}, function (err, result) {
            if (err) {
                res.send("-5");
                return;
            }
            //没有这个人
            if (result.length == 0) {
                res.send("-1"); //用户名不存在
                return;
            }
            //有的话，进一步看看这个人的密码是否匹配
            if (encrypted_passwords == result[0].password) {
                req.session.login = "1";
                req.session.username = username;
                if (remeber_login){
                    var hour = 3600000*24*14;
                    req.session.cookie.expires = new Date(Date.now() + hour);
                    req.session.cookie.maxAge = hour}
                else{
                    req.session.cookie.maxAge = 60000
                }

                res.send("1");  //登陆成功
                return;
            } else {
                res.send("-2");  //密码错误
                return;
            }
        });
    });
};

//注销的执行
exports.doLogout=function(req,res,next){
    req.session.login = null;
    req.session.username = null;
    req.session.error = null;
    res.redirect("/");
    console.log("exit")
};

//Post构件信息
exports.dopostComponentInf = function(req,res,next){

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        var translate = new function(){
            this.translateX = 0;
            this.translateY = 0;
            this.translateZ = 0;
        };
        var rotate = new function(){
            this.rotateX = 0;
            this.rotateY = 0;
            this.rotateZ = 0;
        };
        var scale = new function(){
            this.scaleX = 0;
            this.scaleY = 0;
            this.scaleZ = 0;
        };

        translate.translateX = fields.translateX;
        translate.translateY = fields.translateY;
        translate.translateZ = fields.translateZ;

        rotate.rotateX = fields.rotateX;
        rotate.rotateY = fields.rotateY;
        rotate.rotateZ = fields.rotateZ;

        scale.scaleX = fields.scaleX;
        scale.scaleY = fields.scaleY;
        scale.scaleZ = fields.scaleZ;

        var ObjectName = fields.ObjectName;
        //查询数据库中是不是已写入此数据
        db.find("ComponentInf", {

                "translate.X" : translate.translateX,
                'translate.Y' : translate.translateY,
                'translate.Z' : translate.translateZ,


                'rotate.X' : rotate.rotateX,
                'rotate.Y' : rotate.rotateY,
                'rotate.Z' : rotate.rotateZ,


                'scale.X' : scale.scaleX,
                'scale.Y' : scale.scaleY,
                'scale.Z' : scale.scaleZ,

                "ObjectName" : ObjectName
            }
            , function (err, result) {
                var transferData = {

                    "translate.X" : translate.translateX,
                    'translate.Y' : translate.translateY,
                    'translate.Z' : translate.translateZ,


                    'rotate.X' : rotate.rotateX,
                    'rotate.Y' : rotate.rotateY,
                    'rotate.Z' : rotate.rotateZ,


                    'scale.X' : scale.scaleX,
                    'scale.Y' : scale.scaleY,
                    'scale.Z' : scale.scaleZ,

                    "ObjectName" : ObjectName
                };
             //   console.log(result,transferData);

                if (err) {
                    res.send("-3"); //服务器错误
                    return;
                }
                if (result.length != 0) {
                    console.log(result.length,result);
                    res.send("已存在"); //已存在
                    return;
                }


                db.insertOne("ComponentInf", {
                    "translate": {
                        "X": translate.translateX,
                        "Y": translate.translateY,
                        "Z": translate.translateZ
                    },
                    "rotate": {
                        "X": rotate.rotateX,
                        "Y": rotate.rotateY,
                        "Z": rotate.rotateZ
                    },
                    "scale": {
                        "X": scale.scaleX,
                        "Y": scale.scaleY,
                        "Z": scale.scaleZ
                    },
                    "ObjectName": ObjectName

                }, function (err, result) {
                    if (err) {
                        res.send("-3"); //数据库错误
                        return;
                    }
                    console.log('数据库写入成功');
                    res.send("ok"); //数据库写入成功
                });
            })
    });
};

//Get构件信息
exports.dogetComponentInf = function (req, res, next) {

        var ObjectName = req.query.ObjectName;
        db.find("ComponentInfs",{"ObjectName":ObjectName}, function (err,result){
            if(err || result.length == 0){
                res.json("");
                console.log(ObjectName,"失败");
                return;
            }
            else res.json(result);
        })
};
//请求 http://127.0.0.1:1234/getComponentInf?ObjectName=368667=IfcFlowSegment-0
//返回 [{"_id":"581097211ebcc479021eec35","translate":{"X":"-15.266200000000001","Y":"4.1","Z":"43.403800000000004"},"rotate":{"X":"0","Y":"0","Z":"0"},"scale":{"X":null,"Y":null,"Z":null},"ObjectName":"368667=IfcFlowSegment-0"}]

//Post更新构件信息
exports.dopostUpdateComponentInf = function(req,res,next){

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        var translate = new function(){
            this.translateX = 0;
            this.translateY = 0;
            this.translateZ = 0;
        };
        var rotate = new function(){
            this.rotateX = 0;
            this.rotateY = 0;
            this.rotateZ = 0;
        };
        var scale = new function(){
            this.scaleX = 0;
            this.scaleY = 0;
            this.scaleZ = 0;
        };

        translate.translateX = fields.translateX;
        translate.translateY = fields.translateY;
        translate.translateZ = fields.translateZ;

        rotate.rotateX = fields.rotateX;
        rotate.rotateY = fields.rotateY;
        rotate.rotateZ = fields.rotateZ;

        scale.scaleX = fields.scaleX;
        scale.scaleY = fields.scaleY;
        scale.scaleZ = fields.scaleZ;

        var ObjectName = fields.ObjectName;
        //查询数据库中是不是已写入此数据
        db.find("ComponentInf", {

                "translate.X" : translate.translateX,
                'translate.Y' : translate.translateY,
                'translate.Z' : translate.translateZ,


                'rotate.X' : rotate.rotateX,
                'rotate.Y' : rotate.rotateY,
                'rotate.Z' : rotate.rotateZ,


                'scale.X' : scale.scaleX,
                'scale.Y' : scale.scaleY,
                'scale.Z' : scale.scaleZ,

                "ObjectName" : ObjectName
            }
            , function (err, result) {
                var transferData = {

                    "translate.X" : translate.translateX,
                    'translate.Y' : translate.translateY,
                    'translate.Z' : translate.translateZ,


                    'rotate.X' : rotate.rotateX,
                    'rotate.Y' : rotate.rotateY,
                    'rotate.Z' : rotate.rotateZ,


                    'scale.X' : scale.scaleX,
                    'scale.Y' : scale.scaleY,
                    'scale.Z' : scale.scaleZ,

                    "ObjectName" : ObjectName
                };
                //   console.log(result,transferData);

                if (err) {
                    res.send("-3"); //服务器错误
                    return;
                }
                if (result.length != 0) {
                    res.send("已存在"); //已存在
                    return;
                }

                db.updateMany("ComponentInfs",
                    {"ObjectName": ObjectName},
                    {$set:{
                        "translate": {
                            "X": translate.translateX,
                            "Y": translate.translateY,
                            "Z": translate.translateZ
                        },
                        "rotate": {
                            "X": rotate.rotateX,
                            "Y": rotate.rotateY,
                            "Z": rotate.rotateZ
                        },
                        "scale": {
                            "X": scale.scaleX,
                            "Y": scale.scaleY,
                            "Z": scale.scaleZ
                        }
                    }},
                    function (err, result) {
                    if (err) {
                        res.send("-3"); //数据库错误
                        return;
                    }
                    console.log('数据库写入成功');
                    res.send("ok"); //数据库写入成功
                });
            })
    });
};


//Post VSG信息
exports.postVSG = function(req,res,next){

    var form = new formidable.IncomingForm();
    form.maxFields = 10000000;//设置fields中储存的最大json个数
    form.parse(req, function (err, fields, files) {

        var vsgName = fields.vsgName;

//测试fields值

        var VsgDataKey = [];
        function VsgDataKeyArr(){

            for(var key in fields){
                VsgDataKey.push(key)
            }
            return fields;
        }
        VsgDataKeyArr();
        console.log(VsgDataKey[1],typeof VsgDataKey[1],VsgDataKey[1][0],VsgDataKey.length);




        //查询数据库中是不是已写入此数据
        db.find("vsgs", {
             //
             "vsgInf": fields ,
            "vsgName" : vsgName
           //  "i" : i

            }, function (err, result) {

            if (err) {
                    res.send("-3"); //服务器错误
                    return;
                }
                if (result.length != 0) {
                    res.send("已存在"); //已存在
                    return;
                }

                db.insertOne("vsgs", {
               //     "i" : i,
                    "vsgInf": fields ,
                    "vsgName" : vsgName

                }, function (err, result) {
                    if (err) {
                        res.send("-3"); //数据库错误
                        return;
                    }
                    console.log('数据库写入成功');
                    res.send("ok");    //数据库写入成功
                });
            })
    });
};

//Get VSG信息
exports.dogetVSG = function (req, res, next) {

    var vsgInf = 'vsgInf.'+req.query.vsgInf;
    var vsgName = "W_0";

    var tempDic = {};
    tempDic[vsgInf]=true;
//四个参数，第一个选择collection，第二个查询内容，第三个限制条件，第四个回调
    db.find("vsgs",{"vsgName":vsgName}, tempDic,function (err,result){
        if(err||result=="undefined"){
            res.json("");
            console.log(result,vsgInf,"失败");
            return;
        }

        else{
            console.log(vsgName,result,vsgInf,"成功");
            res.json(result);
        }
    })
};



/*io.on('connection',function(socket){
    console.log("User Connected");

    socket.on("CamData",function(data){
        console.log(data)

        var vsgInf = "vsgInf["+x+'-'+y+'-'+z+"][]";
        var tempDic = {};
        tempDic[vsgInf]=true;

        //四个参数，第一个选择collection，第二个查询内容，第三个限制条件，第四个回调
        var result = db.find("vsgs",{"vsgName":VsgName}, tempDic,function (err,result){
            if(err||result=="undefined"){
                res.json("");
                console.log(result,vsgInf,"失败");
                return;
            }

            else{
                console.log(vsgName,result,vsgInf,"成功");
                return result;
            }
        });


        //查找到的数据返回
        io.emit("CamDataRef",result);
    });

});*/
