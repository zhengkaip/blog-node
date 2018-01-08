var mongoose=require("mongoose");

var categorySchemas=require("../schemas/categoris");

var Category=mongoose.model("Category",categorySchemas);

module.exports=Category;