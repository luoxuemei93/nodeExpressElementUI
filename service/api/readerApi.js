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
        console.log(ret);
        res.send(ret);
    }
}

var dateStr = function(str) {
    return new Date(str.slice(0,7));
}

//获取用户信息列表
router.get('/getReader', (req, res) => {
    var sql_name = $sql.reader.select_name;
    var id=req.params.id;
     if (req.params.id) {
        sql_name += " where id ='"+ req.params.id +"'";
         console.log (sql_name)
     } 
     conn.query(sql_name,req.params.id,function(err, result) {
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
//关键字搜索查询
router.post('/jiansuo', (req, res) => {
    var sql = $sql.reader.select_name;
    var params = req.body;
/*     req.parama.name  == '' ? req.parama.name ='' : req.parama.name  = req.parama.name ;
    req.parama.province  == '' ? req.parama.province ='' : req.parama.province  = req.parama.province ;
    req.parama.card  == '' ? req.parama.card ='' : req.parama.card  = req.parama.card ; */
    if (req.body.name && req.body.province && req.body.card ) {
        sql += " where name ='"+ req.body.name +"' and province ='"+ req.body.province +"' and card ='"+ req.body.card +"'";
         console.log (sql)
     }
    conn.query(sql,function(err, result) {
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
//获取用户详情信息
router.get('/getReaderdetail/:id', (req, res) => {
     conn.query("select * from readerData where id ='"+ req.params.id +"'",function(err, result) {
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
// 增加用户接口
router.post('/addReader', (req, res) => {
    var sql = $sql.reader.add;
    var params = req.body;
    conn.query(sql, [params.id,params.date,params.name, params.province, params.city,params.address,params.zip,params.phone, params.card, params.email], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
// 删除用户接口
router.post('/deleteReader', (req, res) => {
   var sql_delete = $sql.reader.delete;
   var params = req.body;
   console.log(req.query.id);
   if (params.id) {
       sql_delete += " where id ='"+ params.id +"'";
       console.log(sql_delete)
    }
   conn.query(sql_delete, params.id, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.affectedRows === undefined) {
            res.send('删除失败')   //查询不出username，data 返回-1
        } else {
            res.send('ok'); 
        }
    })
});
 //更新用户信息
router.post('/updateReader', (req, res) => {
    var sql_update = $sql.reader.update_reader;
    var params = req.body;
    console.log(params);
    if (params.id) {
        sql_update  += " email = '" + params.email +
                        "',date = '" + params.date +
                        "',name = '" + params.name +
                        "',phone = '" + params.phone +
                        "',card = '" + params.card +
                        "',province = '" + params.province +
                        "',city = '" + params.city +
                        "',address = '" + params.address +
                        "',zip = '" + params.zip +
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

module.exports = router;
