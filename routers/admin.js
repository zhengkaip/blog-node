var express=require("express");

var User=require("../models/User.js");

var Category=require("../models/Category");

var Content=require("../models/Content");

var router=express.Router();

router.get("/",function (req,res,next) {
    if(req.cookies.userInfo.isAdmin){
        res.render("admin/index.html")
    }else {
        res.send("管理员才能访问")
    }
});


router.get("/user",function(req,res,next){
    var page=req.query.page||1;
    var limit=2;
    var skip=0;

    User.count().then(function(count){
        page=Math.min(count,page);
        page=Math.max(page,1);
        skip=(page-1)*limit;
        User.find().limit(limit).skip(skip).then(function(users){
            res.render("admin/user_admin.html",{
                userInfo:req.userInfo,
                users:users,
                page:page,
                count:count,
                url:"user"
            })
        })
    })
});


router.get("/category",function(req,res,next){
    var page=req.query.page||1;
    var limit=2;
    var skip=0;

    Category.count().then(function (count) {
        page=Math.min(count,page);
        page=Math.max(page,1);
        skip=(page-1)*limit;
        Category.find().sort({}).limit(limit).skip(skip).then(function(categoryResult){
            res.render("admin/category_index.html",{
                cates:categoryResult,
                page:page,
                count:count,
                url:"category"
            })
        })
    })
});

router.get("/category/add",function(req,res,next){
    res.render("admin/category_add.html")
});

router.post("/category/add",function(req,res,next){
    var categoryName=req.body.catename;

    if(!categoryName){
        res.render("admin/error.html",{
            error:"未输入分类名",
        })
    }else{
        Category.findOne({name:categoryName}).then(function(result){
            if(result==null){
                new Category({
                    name:categoryName
                }).save();
                res.render("admin/success.html",{
                    message:"保存分类成功",
                    url:"/category"
                })
            }else{
                res.render("admin/error.html",{
                    error:"分类已存在",
                    url:"/category"
                })
            }
        })

    }
});

router.get("/category/edit",function (req,res,next) {
    var id=req.query.id;
    Category.findById(id).then(function(result){
        res.render("admin/cate_edit.html",{
            cate:result
        });
    });
});

router.post("/category/edit",function(req,res,next){
    var catename=req.body.catename;
    var id=req.query.id;
    console.log("id1:",id)
    if(!catename){
        res.render("admin/error.html",{
            error:"分类名不能为空",
        });
        return false;
    }

    Category.findById(id).then(function(result){
        if(catename==result.name){
            res.render("admin/success.html",{
                message:"修改分类成功",
                url:"category"
            });
        }else{
            Category.findOne({
                _id:{$ne : id},
                name:catename
            }).then(function(isExist){
                if(isExist==null){
                    console.log("id2:",id)
                    Category.update({
                        _id:id
                    },{
                        name:catename
                    }).then(function(){
                        res.render("admin/success.html",{
                            message:"修改分类成功",
                            url:"category"
                        });
                    });
                }else{
                    res.render("admin/error.html",{
                        error:"分类名已存在",
                    });
                }
            })
        }
    })
});

router.get("/category/delete",function (req,res,next) {
    var id=req.query._id;
    Category.findById(id).remove().then(function(){
        res.render('admin/success.html',{
            message:"删除成功",
            url:"category",
        })
    });
});

router.get("/content",function(req,res,next){
    var page=req.query.page||1;
    var limit=2;
    var skip=0;

    Content.count().then(function (count) {
        page = Math.min(count, page);
        page = Math.max(page, 1);
        skip = (page - 1) * limit;
        Content.find().sort().limit(limit).skip(skip).populate(['category','user']).then(function(contents){
            console.log(contents)
            res.render("admin/content_index.html",{
                contents:contents,
                page:page,
                count:count,
                url:"content"
            })
        });
    });
})

router.get("/content/add",function(req,res,next){
    Category.find().then(function(cates){
        res.render("admin/content_add.html",{
            cates:cates
        });
    })
})

router.post("/content/add",function(req,res,next){
    console.log(req)
    new Content({
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,
        date:new Date(),
        user:req.cookies.userInfo._id
    }).save().then(function(){
        res.render("admin/success.html",{
            message:"添加成功",
            url:"content"
        })
    })
});

router.get("/content/edit",function(req,res,next){
    var id=req.query.id;

    Category.find().then(function(cates){
        Content.findOne({_id:id}).then(function(contents){
            res.render("admin/content_edit.html",{
                cates:cates,
                contents:contents
            })
        });
    });
});

router.post("/content/edit",function(req,res,next){
    var id=req.query.id;

    if(req.body.title==""){
        res.render("admin/error.html",{
            error:"标题不能为空",
            url:"/content"
        })
    }

    if(req.body.description==""){
        res.render("admin/error.html",{
            error:"描述不能为空",
            url:"/content"
        })
    }

    if(req.body.content==""){
        res.render("admin/error.html",{
            error:"内容不能为空",
            url:"/content"
        })
    }

    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function(){
        res.render("admin/success.html",{
            message:"修改成功",
            url:"content"
        })
    });
});

router.get("/content/delete",function(req,res,next){
    var id=req.query.id;

    Content.remove({_id:id}).then(function(){
        res.render("admin/success.html",{
            message:"删除成功",
            url:"content"
        })
    })
});

module.exports=router;