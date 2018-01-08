var mongoose=require("mongoose");

var contentSchema=require("../schemas/content");


var Content=mongoose.model("Content",contentSchema);

module.exports=Content;