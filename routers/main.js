var express=require("express");

var Category=require("../models/Category");

var Content=require("../models/Content");

var router=express.Router();

var data=null

router.use(function(req,res,next){
    data={
        userInfo:null,
        cates:null,
        limit:2,
        skip:0,
        page:req.query.page||1,
        totalPage:0,
        count:0,
    };

    Category.find().sort({_id:-1}).then(function(result){
        data.userInfo = req.cookies.userInfo;
        data.cates = result;
        next();
    });
});

router.get("/",function (req,res,next) {

    data.where=req.query.category;

    var where={};

    if(data.where){
        where.category=data.where;
    }
    Content.where(where).count().then(function(count){
        Content.where(where).find().limit(data.limit).skip(data.skip)
            .then(function(contents){
                data.count=count;
                data.page = Math.min(data.count, data.page);
                data.page = Math.max(data.page, 1);
                data.skip = (data.page - 1) * data.limit;
                data.totalPage=Math.ceil(data.count/data.limit);
                data.contents=contents;
                res.render("main/index",data)
            })
    });
});

router.get("/view",function(req,res,next){
    Content.findById({_id:req.query.content}).then(function(contents){
        Content.update({
            _id:req.query.content
        },{
            views:contents.views+1
        }).then(function(){
            Content.findById({_id:req.query.content}).then(function(content){
                var skip=0;
                var limit=2;
                var page=req.query.page||1;
                data.url="/view";
                data.comment={};
                data.comment.limit=limit;
                data.comment.page=page;
                data.comment.allPage=Math.ceil(content.comment.length/limit);
                data.comment.number=content.comment.length;


                skip=limit*(page-1);

                data.content=content;
                data.content.comment=data.content.comment.slice(skip,limit*page+1);


                data.url="/view";
                res.render("main/content_view.html",data);
            });
        });
    })
});

router.post("/view",function(req,res,next){
    Content.findById({
        _id:req.query.content
    }).then(function(content){
        var commentObject={};
        commentObject.content=req.body.content;
        commentObject.postDate=new Date();
        commentObject.username=req.cookies.userInfo.username;
        content.comment.push(commentObject);
        return content.save();
    }).then(function(content){
        var skip=0;
        var limit=2;
        var page=req.query.page||1;
        data.content=content;
        data.url="/view";
        data.comment={}
        data.comment.limit=limit;
        data.comment.page=page;
        data.comment.allPage=Math.ceil(content.comment.length/limit);

        skip=limit*(page-1);

        data.content=content;
        data.content.comment=data.content.comment.slice(skip,limit*page+1);

        res.render("main/content_view.html",data);
    })
});

module.exports=router