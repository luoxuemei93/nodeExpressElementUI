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
        res.send(ret);
    }
}

var dateStr = function(str) {
    return new Date(str.slice(0,7));
}

// 增加品牌接口
router.post('/addBrand', (req, res) => {
    var sqlCheck = $sql.product.count_by_pname;   //根据商品名称查询商品是否唯一性
    var sql = $sql.product.batchadd;
    var params = req.body;
    var batchSql = [];
    if(params.pname != '' || params.pname != undefined){   //父品牌名称不为空
        batchSql.push([params.pname,'-1']);
        for(var i = 0;i<params.subName.length;i++) {
            batchSql.push([params.subName[i],params.pname]);
        }
    }
    conn.query(sql, [batchSql], function(err, result) {
        if (err) {
            jsonWrite(res, {
                status:'-200',
                msg:'新增失败，请查看品牌是否已存在！'
            });
        }
        if (result) {
            jsonWrite(res, {
                status:'200',
                msg:'新增成功'
            });
        }
    })
});

// 查询品牌列表接口
router.post('/getBrandList', (req, res) => {
    var sql = $sql.product.selectClass;   // 查询所有品牌列表
    conn.query(sql, [], function(err, result) {
        if (err) {
            jsonWrite(res, {
                status:'-200',
                msg:'新增失败，请查看品牌是否已存在！'
            });
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
// 查询明细总和
router.post('/getBrandDetailTotal', (req, res) => {
    var sql="";
    if(req.body.className){
        sql = "select count(1) as total from producttable where productClass1 = '"+req.body.className+"'";   // 查询所有品牌列表
    } else {
        sql= "select count(1) as total from producttable";   // 查询所有品牌列表
    }
    conn.query(sql, function(err, result) {
        // console.log(sql);
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
});
// 查询品牌明细列表接口
router.post('/getBrandDetailList', (req, res) => {
    var sql="";
    // console.log(req.body);
    if(req.body.className){
        sql = "select * from producttable where productClass1 = '"+req.body.className+"' " +
            "limit "  + (req.body.pageSize*(req.body.pageNo-1))*1+','+req.body.pageSize;   // 查询所有品牌列表
        //limit 用法查询第0条数据之后的10条数据（即查询1-10条数据）。limit 0,10
    } else {
        sql= "select * from producttable limit " + (req.body.pageSize*(req.body.pageNo-1))*1+','+req.body.pageSize;   // 查询所有品牌列表
    }
    conn.query(sql, function(err, result) {
        // console.log(sql);
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
});

// 加入购物车
router.post('/saveOrderProd', (req, res) => {
    var valuesList = [];
    valuesList.push([
        req.body.userName,
        req.body.productId,
        req.body.productDesc,
        req.body.productSize,
        req.body.unit,
        req.body.orderNum,  //下单数量
        req.body.salePrice,
        req.body.volume,
        req.body.shelfLife,
        req.body.orderDate
    ])
    var checkSql = "select count(*) as isExit from shopCartable where userName='"+req.body.userName+"' && productId = '"+ req.body.productId+"'";
    var insertSql = "insert into shopCartable(userName,productId,productDesc,productSize,unit,quantity,salePrice,volume,qualityPeriod,orderDate) VALUES ?";   // 查询所有品牌列表
    var updateSql = "update shopCartable SET quantity = quantity + "+req.body.orderNum+", orderDate = '"+req.body.orderDate+"'" +
        " where userName='"+req.body.userName+"' && productId = '"+ req.body.productId+"'";
    console.log(checkSql);
    conn.query(checkSql,function(err, result) { //先判断当前用户是否存在该产品信息
        if (err) {jsonWrite(res, {status:'-200', msg:'加入购物车失败！'});}
        if (result) {
            var isExitInTB = result[0].isExit;
            if(isExitInTB == 0){    // 表明当前用户没有把产品加入购物车，需要新增
                conn.query(insertSql,[valuesList],function(err, result) {
                    if (err) {jsonWrite(res, {status:'-200', msg:'加入购物车失败！'});}
                    if (result) {jsonWrite(res, {status:'200', msg:'加入购物车成功！'});}
                })
            } else {    // 需要修改购物车的订单数量以及时间
                conn.query(updateSql,function(err, result) {
                    // console.log(updateSql);
                    if (err) {jsonWrite(res, {status:'-200', msg:'订购失败！'});}
                    if (result) {jsonWrite(res, {status:'200', msg:'加入购物车成功成功！'});}
                })
            }
        }
    })
});

// 查询购物车
router.post('/queryOrderProd', (req, res) => {
    var sql = "select tba.*,tbb.picturePath from shopCartable as tba left join producttable as tbb on tba.productId = tbb.productId " +
        " where tba.userName = '"+req.body.userName+"'";   // 查询所有品牌列表
    conn.query(sql, function(err, result) {
        if (err) {
            jsonWrite(res, {status:'-200', msg:'查询失败！'});
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

// 删除购物车的数据
router.post('/delOrderProd', (req, res) => {
    console.log(req.body);
    var sql = "DELETE from shopCartable  where productId in ('"+req.body.productId+"') and userName = '"+req.body.userName+"'";   // 查询所有品牌列表
    console.log(sql);
    conn.query(sql, function(err, result) {
        if (err) {
            jsonWrite(res, {status:'-200', msg:'移除失败！'});
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
// 从购物车下单，多条。下单成功后，还要删除购物车表的数据
router.post('/doShopFromCarProd', (req, res) => {
    var totalPrice = 0;
    var userName = '';
    var orderNumber = new Date().getTime().toString(); //订单号=时间戳
    var productTypesCount = req.body.optList.length;    // 下单的商品类型个数
    var valuesList = [];
    var ll = "";
    if(req.body.optList.length >0){
        ll = "'"+req.body.optList[0].productId+"'";
        userName = req.body.optList[0].userName;
        totalPrice =req.body.optList[0].salePrice * req.body.optList[0].quantity;    // 单价*数量
        valuesList.push([
            orderNumber,
            1,  // 订单状态1，表示下单完成
            req.body.optList[0].userName,
            req.body.optList[0].productId,
            req.body.optList[0].productDesc,
            req.body.optList[0].productSize,
            req.body.optList[0].unit,
            req.body.optList[0].quantity,  //下单数量
            req.body.optList[0].salePrice,
            req.body.optList[0].volume,
            req.body.optList[0].qualityPeriod,
        ])
    }
    for(var i =1 ;i<req.body.optList.length;i++){
        ll = ll+",'"+req.body.optList[i].productId+"'";
        totalPrice =totalPrice*1+(req.body.optList[0].salePrice * req.body.optList[0].quantity)*1;    // 单价*数量
        valuesList.push([
            orderNumber,
            1,  // 订单状态1，表示下单完成
            req.body.optList[i].userName,
            req.body.optList[i].productId,
            req.body.optList[i].productDesc,
            req.body.optList[i].productSize,
            req.body.optList[i].unit,
            req.body.optList[i].quantity,  //下单数量
            req.body.optList[i].salePrice,
            req.body.optList[i].volume,
            req.body.optList[i].qualityPeriod,
        ])
    }
    var insertIntoOrdetTable =  "insert into ordertable(orderNumber,orderState,productTypesCount,totalPrice,userName) VALUES ('"+orderNumber+"',1,"+productTypesCount+","+totalPrice+",'"+userName+"')";   // 新增订单数据
    var insertsql = "insert into orderdetailtable(orderNumber,orderState,userName,productId,productDesc,productSize,unit,quantity,salePrice,volume,qualityPeriod) VALUES ?";   // 新增订单明细数据
    var delsql = "DELETE from shopCartable  where productId in ("+ll+") and userName = '"+req.body.optList[0].userName+"'";   // 删除购物车的数据

    console.log(insertIntoOrdetTable);
    console.log(valuesList);
    // console.log(insertsql);
    conn.query(insertIntoOrdetTable,function(err, result) {
        if (err) {
            jsonWrite(res, {status:'-200', msg:'订购失败！'});
        }
        if (result) {
            console.log('加入订单成功');
            conn.query(insertsql, [valuesList],function(err, result) {
                console.log(insertsql);
                if (err) {
                    console.log(err);
                    jsonWrite(res, {status:'-200', msg:'订购失败！'});
                }
                if (result) {
                    console.log('加入订单明细');
                    jsonWrite(res, {status:'200', msg:'下单成功！'});
                    conn.query(delsql, function(errDel, resultDel) {})// 删除购物车的数据
                }
            })
        }
    })
});
module.exports = router;
