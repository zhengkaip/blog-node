var express = require("express");

var router = express.Router();

var User = require("../models/User");

var responseData;

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ""
    }
    next();
})

router.post("/user/register", function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if (username == "") {
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return false;
    }
    if (password == "") {
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return false;
    }
    if (password != repassword) {
        responseData.code = 3;
        responseData.message = "两次密码不一致"
    }

    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            responseData.code = 4;
            responseData.message = "用户名已存在";
            res.json(responseData);
        } else {
            var newUser = new User({
                username: username,
                password: password
            });
            return newUser.save();
        }
    }).then(function (newUserInfo) {
        console.log(newUserInfo)
        responseData.message = "注册成功";
        res.cookie('userInfo', {
            _id: newUserInfo._id,
            username: newUserInfo.username
        })
        res.json(responseData);
    })
})

router.post("/user/login", function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if (username == '' || password == '') {
        responseData.code = 5
        responseData.message = "用户名或密码为空";
        res.json(responseData);
        return false;
    }

    User.findOne({
        username: username,
        password: password
    }).then(function (result) {
        if (result) {
            responseData.message = "登录成功";
            responseData.user = {
                _id: result._id,
                username: result.username,
            };
            res.cookie('userInfo', result)
        } else {
            responseData.code = 1;
            responseData.message = "用户名或密码错误";
        }
        console.log("responseData:", responseData)
        res.json(responseData);
    })

})

router.get("/user/logout", function (req, res, next) {
    res.cookie('userInfo', {
        _id: '',
        username: ''
    });
    res.json(responseData);
})


module.exports = router