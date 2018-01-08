var mongoose=require("mongoose");

var Schemas=mongoose.Schema;


module.exports=new Schemas({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },

    title:String,

    description:{
        type:String,
        default:""
    },

    content:{
        type:String,
        default:""
    },

    date:String,

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    views:{
        type:Number,
        default:0
    },

    comment:{
        type:Array,
        default:[],
    }

})