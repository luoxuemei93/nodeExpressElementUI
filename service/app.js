const userApi = require('./api/userApi');
const readerApi = require('./api/readerApi');
const newsApi = require('./api/newsApi');
const productApi = require('./api/productApi');   //产品模块api
const viewOrder = require('./api/viewOrder');   //订单模块api

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())

app.use('/api/user', userApi);
app.use('/api/reader', readerApi);
app.use('/api/news', newsApi);
app.use('/api/product', productApi);  //产品模块
app.use('/api/viewOrder', viewOrder);  //订单模块



app.listen(3000);
console.log('success listen at port: 3000')
