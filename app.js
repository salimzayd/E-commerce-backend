require("dotenv").config();
const mongoose = require('mongoose')
const express = require("express")
const bodyParser = require('body-parser')
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const app = express()
const port = 3004




const mongodb = "mongodb://127.0.0.1:27017/ecommerce";

main().catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongodb)
    console.log("db connected");
}


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())
app.use("/api/users",userRouter)
app.use("/api/admin",adminRouter)



app.listen(port,() =>{
    console.log("server is listening in port",port);
})