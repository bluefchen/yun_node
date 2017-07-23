/**
 * Created by Danny on 2015/9/25 9:31.
 */
//这个模块里面封装了所有对数据库的常用操作
var MongoClient = require('mongodb').MongoClient;
var settings = require("../settings.js");
var dbs = null;
//不管数据库什么操作，都是先连接数据库，所以我们可以把连接数据库
//封装成为内部函数
function _connectDB(callback) {
    var url = settings.dburl;   //从settings文件中，都数据库地址
    //连接数据库
    MongoClient.connect(url, function (err, db) {
        if (err) {
            throw err;
        }
        callback(err, db);

    });
}



init();

function init(){
    //对数据库进行一个初始化
    _connectDB(function(err, db){
        if (err) {
            console.log(err);
            return;
        }
        dbs = db;
        db.collection('users').createIndex(
            { "username": 1},
            null,
            function(err, results) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("索引建立成功");
            }
        );
    });
}

//插入数据
exports.insertOne = function (collectionName, json, callback) {
        var collection = dbs.collection(collectionName);

        if (typeof collection === 'undefined'||'null') {
            dbs.createCollection(collectionName);
            collection = dbs.collection(collectionName);
        }
        dbs.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
        })
};

//查找数据，找到所有数据。args是个对象{"pageamount":10,"page":10}
exports.find = function (collectionName, json, C, D) {
    var result = [];    //结果数组
    if (arguments.length == 3) {
        //那么参数C就是callback，参数D没有传。
        var callback = C;
        var cursor = dbs.collection(collectionName).find(json);

        var collection = dbs.collection(collectionName);

        if (typeof collection === 'undefined'||'null') {
            dbs.createCollection(collectionName);
        }

        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                //    dbs.close();  // 关闭数据库
                return;
            }
            if (doc != null) {
                result.push(doc);   //放入结果数组
            } else {
                //遍历结束，没有更多的文档了
                callback(null, result);
                //    db.close();  //关闭数据库
            }
        });


    } else if (arguments.length == 4) {
        var callback = D;
        var args = C;//其中C为限制mongodb中查找输出项。格式：db.vsgs.find({"vsgName":"W_0"},{"vsgInf.vsgInf[41-65-9][]":true})
        var cursor = dbs.collection(collectionName).findOne(json,C,callback);
        console.log(C)

    } else {
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        return;
    }

}

//删除
exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        //删除
        db.collection(collectionName).deleteMany(
            json,
            function (err, results) {
                callback(err, results);
            //    db.close(); //关闭数据库
            }
        );
    });
}

//修改
exports.updateMany = function (collectionName, json1, json2, callback) {
        dbs.collection(collectionName).updateMany(
            json1,
            json2,
            function (err, results) {
                callback(err, results);
            //  dbs.close();
            });
}

//得到总数量
exports.getAllCount = function (collectionName,callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
        //    db.close();
        });
    })
}