var express=require("express")

var swig=require("swig");

var mongoose=require("mongoose");

var bodyParser=require("body-parser");

var CookieParser=require("cookie-parser");

var User=require("./models/User");


mongoose.Promise = require('bluebird');

var app=express();

app.use("/public",express.static(__dirname+"/public"));

/*定义当前应用使用的模板引擎*/

/*第一个参数模板名字，第二个参数模板处理方法*/
app.engine("html",swig.renderFile);

/*设置模板存放目录，第一个参数必须为views,第二个参数为存放目录*/
app.set("views","./views");

/*注册使用的模板引擎，第一个参数必须为view engine,第二个参数为你定义的模板引擎名称*/

app.set("view engine","html");

/*不缓存模板*/
swig.setDefaults({cache:false})


/*解析post请求的url中间件*/
app.use(bodyParser.urlencoded({extended:true}));

/*设置cookie*/
app.use(CookieParser());

app.use("/admin",require("./routers/admin.js"));

app.use("/api",require("./routers/api.js"));

app.use("/",require("./routers/main.js"));


var promise=mongoose.connect("mongodb://localhost:27017/blog",{
    useMongoClient:true
})

promise.then(function(data){
    console.log("数据连接成功")
    app.listen(8082);
},function(err){
    console.log("数据连接失败")
})