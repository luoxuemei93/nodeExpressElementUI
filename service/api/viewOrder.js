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
        res.send({status:200,rows:ret});
    }
}
var jsonWriteData = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.send('err');
    } else {
        res.send(ret);
    }
}
var dateStr = function(str) {
    return new Date(str.slice(0,7));
}

// 查询总数
router.post('/getViewOrderTotal', (req, res) => {
    var sql="";
    if(req.body.className){
        sql = "select count(1) as total from ordertable where productClass1 = '"+req.body.className+"'";   // 查询所有品牌列表
    } else {
        sql= "select count(1) as total from ordertable";   // 查询所有品牌列表
    }
    conn.query(sql, function(err, result) {
        if (err) {
            jsonWrite(res, {
                status:'-200',
                msg:'查询失败！'
            });
        }
        if (result) {
            jsonWriteData(res, result);
        }
    })
});
//获取用户订单信息
router.post('/getViewOrderList', (req, res) => {
    console.log(req.body);
    var sql = "select * from ordertable where username = '"+req.body.userName+"' order by orderDate desc limit "  + (req.body.pageSize*(req.body.pageNo-1))*1+','+req.body.pageSize;   // 查询所有品牌列表
    conn.query(sql, function(err, result) {
        if (err) {
            jsonWrite(res, {
                status:'-200',
                msg:'查询失败！'
            });
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
})

// 查询订单明细
router.post('/getViewOrderDetailList', (req, res) => {
    console.log(req.body);
    var sql = "select tba.*,tbb.picturePath from orderdetailtable as tba left join producttable as tbb on tba.productId = tbb.productId  where orderNumber = '"+req.body.orderNumber+"' order by orderDate desc";
    console.log(sql);
    conn.query(sql, function(err, result) {
        if (err) {
            jsonWrite(res, {
                status:'-200',
                msg:'查询失败！'
            });
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
})
module.exports = router;
