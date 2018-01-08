var mongoose=require("mongoose");

var usersSchema=require("../schemas/users")


var User=mongoose.model('User',usersSchema)


module.exports=User