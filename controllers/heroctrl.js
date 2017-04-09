/**
 * Created by xinbob on 4/9/17.
 *
 * 控制器
 */

var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var heroModel = require('../models/heroMod');

/**
 * 显示首页
 */
exports.showIndex = function (req, res) {

    heroModel.queryAll(function (err, data) {
        if (err) {
            res.end(JSON.stringify({
                err_code: 500,
                message: err.message
            }));
        }

        res.render('index', {
            list: data.heros
        });
    })
};

/**
 * 查看某位英雄的信息
 */
exports.showHeroInfo = function (req, res) {

    // req.query 使用node url核心模块
    // 直接将请求路径中的查询字符串转为对象 作为一个属性 添加到req对象上面
    // 此处直接使用
    var heroId = req.query.id;

    heroModel.queryHeroById(heroId, function (err, hero) {
        if (err) {
            return res.end(JSON.parse({
                err_code: 500,
                message: err.message
            }));
        }

        // 渲染info.html
        res.render('info', {
            hero: hero
        });
    })
};


/**
 * 编辑某位英雄的信息
 */
exports.showEditHeroInfo = function (req, res) {

    // 之前 req.query 使用node url核心模块
    // 直接将请求路径中的查询字符串转为对象 作为一个属性 添加到req对象上面
    // 此处直接使用
    var heroId = req.query.id;

    heroModel.queryHeroById(heroId, function (err, hero) {
        if (err) {
            return res.end(JSON.parse({
                err_code: 500,
                message: err.message
            }));
        }

        res.render('edit', {
            hero: hero
        });
    })
};

/**
 * 编辑某一位英雄的信息
 */
exports.doEditHeroInfo = function (req, res) {
    // formidable 插件
    var form = new formidable.IncomingForm();

    form.uploadDir = "./public/upload";
    form.keepExtensions = true;

    form.parse(req, function (err, fields, files) {
        if (err) {
            res.end(JSON.stringify({
                err_code: 500,
                message: err.message
            }));
        }

        var body = fields;

        if (files.avatar.size === 0) {
            // 用原来的
            body.avatar = fields.origin_avatar;
            fs.unlink(files.avatar.path);

        } else {
            body.avatar = files.avatar.path;
        }

        // 修改库中的英雄信息
        heroModel.updateById(body, function (err) {
            if (err) {
                return res.end(JSON.stringify({
                    err_code: 500,
                    message: err.message
                }))
            }

            res.end(JSON.stringify({
                err_code: 0
            }))
        })

    });

};


/**
 * 显示添加英雄页面
 */
exports.showAdd = function (req, res) {
    res.render('add', {
        title: 'NodeJS'
    });
};


/**
 * 添加一位
 */
exports.doAdd = function (req, res) {

    // formidable插件 处理带有文件的表单上传
    var form = new formidable.IncomingForm();

    // form.uploadDir = "./img/"; // 配置上传的文件保存路径
    // form.keepExtensions = true; // 保持文件扩展名

    // 获取客户端传递过来的参数
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }

        // 表单数据
        var body = fields;
        // 头像
        body.avatar = body.avatar_src;

        // 写入数据库
        heroModel.addHero(body, function (err) {
            if (err) {
                return res.end(JSON.stringify({
                    err_code: 500,
                    message: err.message
                }));
            }

            // 写入db成功后返回给客户端 写入成功
            res.end(JSON.stringify({
                err_code: 0
            }));
        })

    });
};


/**
 * 上传头像预览
 */
exports.doUpload = function (req, res) {

    // formidable插件 处理带有文件的表单上传
    var form = new formidable.IncomingForm();

    form.uploadDir = "./public/upload"; // 配置上传的文件保存路径
    form.keepExtensions = true; // 保持文件扩展名

    // 获取客户端传递过来的参数
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.end(JSON.stringify({
                err_code: 500,
                message: err.message
            }));
        }

        var body = fields;
        // 临时头像 预览使用
        body.avatar = files.avatar.path;

        res.end(JSON.stringify({
            err_code: 0,
            result: '/' + body.avatar // 返回上传成功后的头像的地址
        }))
    });
};

/**
 * 查询全部
 */
exports.getAllHero = function (req, res) {

    heroModel.queryAll(function (err, data) {
        if (err) {
            res.end(JSON.stringify({
                err_code: 500,
                message: err.message
            }));
        }

        res.end(JSON.stringify({
            err_code: 0,
            result: data
        }))
    })

};

/**
 * 删除一位
 */
exports.deleteHero = function (req, res) {
    var heroId = req.query.id;
    console.log('heroId = ' + heroId);

    heroModel.deleteHeroById(heroId, function (err) {
        if (err) {
            res.end(JSON.stringify({
                err_code: 500,
                message: err.message
            }))
        }

        res.end(JSON.stringify({
            err_code: 0
        }))
    })
};





