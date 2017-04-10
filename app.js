/**
 * Created by xinbob on 4/5/17.
 *
 * 入口文件
 * NodeJS开发框架express
 */

var express = require('express');
var heroRouter = require('./routes/heroRou');
var ejs = require('ejs');

var app = express(); // <- var server = http.createServer();

// 开放静态资源
app.use('/node_modules/', express.static('./node_modules/'));
app.use('/public/', express.static('./public/'));

// 配置ejs模板引擎
ejs.delimiter = '@';
// ejs 识别结尾为html的模板文件
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// ejs模板引擎 默认去项目根目录下views文件夹中寻找模板文件
// 也可以对其进行配置

// 使用该路由
app.use(heroRouter);

// 监听3000端口
app.listen(3000, function () {
    console.log('server is running...');
});