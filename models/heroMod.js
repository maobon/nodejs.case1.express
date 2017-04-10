/**
 * Created by xinbob on 4/6/17.
 *
 * 业务层
 */

var fs = require('fs');

var dbPath = './db.json';

/**
 * 查询全部 select * from table
 * 因为fs.readFile()是异步执行的 什么时候读取完成不确定
 * 最终读取完成的结果通过回调函数传递出去
 *
 * @param callback
 */
function queryAll(callback) {
    fs.readFile(dbPath, function (err, data) {
        if (err) {
            return callback(err);
        }
        // 顺带转为对象
        callback(null, JSON.parse(data));
    });
}

/**
 * 写回数据库
 *
 * @param data 全部数据
 * @param callback
 */
function saveIntoDB(data, callback) {
    // 写会数据库 {} -> String
    fs.writeFile(dbPath, JSON.stringify(data, null, '  '), function (err) {
        if (err) {
            callback(err);
        }
        // 写库完成后调回调函数 不用传参数 仅为通知任务完成
        callback(null);
    })

    // 写法二
    // fs.writeFile(dbPath, JSON.stringify(data), callback);
}


// 导出查询全部方法
exports.queryAll = queryAll;


/**
 * 根据id查询英雄
 *
 * @param id
 * @param callback
 */
exports.queryHeroById = function (id, callback) {
    id = parseInt(id);

    // 调用查询全部方法
    queryAll(function (err, data) {
        if (err) {
            return callback(err);
        }

        var heros = data.heros;
        // some()相对foreach()可以终止遍历
        heros.some(function (item) {
            if (item.id === id) {
                callback(null, item);
                return true; // return true 终止遍历操作
            }
        });
    })
};

/**
 * 根据该id删除对应的英雄
 *
 * @param id
 * @param callback
 */
exports.deleteHeroById = function (id, callback) {
    id = parseInt(id);

    queryAll(function (err, data) {
        if (err) {
            return callback(err);
        }

        var heros = data.heros;
        heros.some(function (item, index) {
            if (item.id === id) {
                // 根据当前遍历时的索引 从数组中删除该item
                heros.splice(index, 1);
                // 重新写回数据库中
                saveIntoDB(data, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                })

                return true; // return true 终止遍历操作
            }
        });

    })

}


/**
 * 增加英雄
 *
 * @param hero
 * @param callback
 */
exports.addHero = function (hero, callback) {
    // 查库 -> 该值 -> 写回
    queryAll(function (err, data) {
        if (err) {
            return callback(err);
        }

        // data.heros对象添加id属性
        // 比当前数据库中heros数据最后一项的id加1
        hero.id = data.heros.length === 0 ? 1 : data.heros[data.heros.length - 1].id + 1;
        data.heros.push(hero);

        // obj -> string 调整string数据格式
        data = JSON.stringify(data, null, '  ');
        // string -> obj
        data = JSON.parse(data);

        // 写回数据库
        // fs.write(dbPath, data, function (err) {
        //     if (err) {
        //         return callback(err);
        //     }
        //
        //     // 通知调用者 写数据库任务完成 不用传递结果
        //     callback(null);
        // })

        saveIntoDB(data, function (err) {
            if (err) {
                callback(err);
            }
            callback(null);
        })

    })
};


/**
 * 修改某一名英雄的信息
 *
 * @param hero
 * @param callback
 */
exports.updateById = function (hero, callback) {
    // hero的id属性 转为number类型
    hero.id = parseInt(hero.id);

    // 查询全部
    queryAll(function (err, data) {
        if (err) {
            return callback(err);
        }

        // 遍历库中所有hero对象 比对id
        data.heros.some(function (item) {

            // id一致时 将hero对象的所有属性 拷贝到item中
            if (item.id === hero.id) {
                // 拷贝传入hero对象的属性
                for (var key in hero) {
                    item[key] = hero[key]
                }

                // 写回数据库
                saveIntoDB(data, callback);
                // 终止遍历
                return true;
            }
        })
    })
};

