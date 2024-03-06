const mongoos = require('mongoose');


const userSchema = new mongoos.Schema({
    name:String,
    email:String,
    username:String,
    password:String,

    cart:[{type:mongoos.Schema.ObjectId,ref:'product', autopopulate:true}],
    wishlist:[{type:mongoos.Schema.ObjectId,ref:'product'}],
    orders:[{type:mongoos.Schema.ObjectId,ref:"orders"}]
})


module.exports = mongoos.model("user",userSchema)