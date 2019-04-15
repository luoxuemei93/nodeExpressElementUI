var models = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(models.mysql);

conn.connect();
var multer  = require('multer');
var upload = multer({ dest: 'upload/' });
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


// 单图上传
router.post('/upload', upload.single('logo'), function(req, res, next){
    res.send({ret_code: '0'});
});

// 导出模块（在 app.js 中引入）
module.exports = router;
