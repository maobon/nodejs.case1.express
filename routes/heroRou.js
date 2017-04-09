/**
 * Created by xinbob on 4/5/17.
 *
 * 路由
 */

var express = require('express');

var heroCtrl = require('../controllers/heroctrl');

var router = express.Router();

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
