const mongoose = require('mongoose')
const orderschema = mongoose.Schema({


    userid:String,
    products:[{type:mongoose.Schema.ObjectId,ref:"products"}],
    data:{type:String,default:() => new Date().toLocaleDateString()},
    time:{type:String,default:() => new Date().toLocaleTimeString()},
    order_id:String,
    payment_id:String,
    total_amount:Number
},{strictPopulate:false}) 



module.exports = mongoose.model("orders",orderschema)