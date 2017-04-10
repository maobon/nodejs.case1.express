/**
 * Created by xinbob on 4/5/17.
 *
 * 路由
 */

var express = require('express');
var heroCtrl = require('../controllers/heroctrl');

// 获取路由实例
var router = express.Router();

// 配置路由 .get()是GET请求 .post()是POST请求
// 参数2 为回调函数 执行请求URL标识符对应的handler

router
// 首页
    .get('/', heroCtrl.showIndex)

    // 添加
    .get('/add', heroCtrl.showAdd)
    .post('/add', heroCtrl.doAdd)

    // 查看(一位)
    .get('/info', heroCtrl.showHeroInfo)

    // 编辑(一位)
    .get('/edit', heroCtrl.showEditHeroInfo)
    .post('/edit', heroCtrl.doEditHeroInfo)

    // 上传头像
    .post('/upload', heroCtrl.doUpload)

    // 删除(一位)
    .get('/delete', heroCtrl.deleteHero)
    .get('/checkall', heroCtrl.getAllHero);


module.exports = router;
