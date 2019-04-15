var models = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(models.mysql);

conn.connect();

var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.send('err');
    } else {
        res.send({status:'200', message:'修改成功'});
    }
}

var dateStr = function(str) {
    return new Date(str.slice(0,7));
}

// 增加用户接口
router.post('/addUser', (req, res) => {
    var sql = $sql.user.add;
    var params = req.body;
    // console.log(params);
    // console.log(params.birth);
    conn.query(sql, [params.name, params.account, params.pass, params.checkPass,
                    params.email, params.phone, params.card, dateStr(params.birth), params.sex], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

//查找用户接口，用于登陆校验
router.post('/login', (req, res) => {
    var sql_name = $sql.user.select_name;
    // var sql_password = $sql.user.select_password;
    var params = req.body;
    var keywords = JSON.parse(Object.keys(params)[0]);
    if (keywords.name) {
        sql_name += " where userName ='"+ keywords.name +"'";
    }
    conn.query(sql_name, keywords.name, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {  //返回为空
            res.send('-1')   //查询不出username，data 返回-1
        } else {    // 返回不为空的话
            var resultArray = result[0];
            if(resultArray.password === keywords.password) {
                jsonWrite(res, result);
            } else {
                res.send('0')   //username
            }
        }
    })
});

//获取用户信息
router.get('/getUser', (req, res) => {
    var sql_name = $sql.user.select_name;
    // var sql_password = $sql.user.select_password;
    var params = req.body;
    console.log(params);
    if (params.name) {
        sql_name += "where username ='"+ params.name +"'";
    }
    conn.query(sql_name, params.name, function(err, result) {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send('-1')   //查询不出username，data 返回-1
        } else {
            jsonWrite(res, result);
        }
    })
});

//更新用户信息
router.post('/updateUser', (req, res) => {
    var sql_update = $sql.user.update_user;
    var params = req.body;
    console.log(params);
    if (params.id) {
        sql_update  += " email = '" + params.email +
                        "',phone = '" + params.phone +
                        "',card = '" + params.card +
                        "',birth = '" + params.birth +
                        "',sex = '" + params.sex +
                        "' where id ='"+ params.id + "'";
    }
    conn.query(sql_update, params.id, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        if (result.affectedRows === undefined) {
            res.send('更新失败，请联系管理员')   //查询不出username，data 返回-1
        } else {
            res.send('ok');
        }
    })
});

//更改密码
router.post('/modifyPassword', (req, res) => {
    var sql_modify = $sql.user.update_user;
    var params = req.body;
    console.log(params);
    if (params.userName) {
        sql_modify +=  " password = '" + params.pass + "' where userName ='"+ params.userName + "'";
    }
    console.log(sql_modify);
    conn.query(sql_modify, function(err, result) {
        if (err) {
            jsonWrite(res, {
                status:'-200',
                msg:'修改失败，请重新登录！'
            });
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//获取用户中心列表
router.get('/getUsercenter', (req, res) => {
    var sql_uercenter= $sql.user.select_usercenter;
    // var sql_password = $sql.user.select_password;
/*      var params = req.body;
    console.log(params);
    if (params.name) {
        sql_name += "where username ='"+ params.name +"'";
    }  */
    conn.query(sql_uercenter,  function(err, result) {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send('-1')   //查询不出username，data 返回-1
        } else {
            jsonWrite(res, result);
        }
    })
});

module.exports = router;
