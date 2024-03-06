const express = require('express');
const router = express.Router()
const userController = require("../controller/userController")

const tryCatchMiddleware = require("../middlewares/trycatch")
const verifyToken = require("../middlewares/userAuth")


router 

.post("/register",tryCatchMiddleware(userController.userRegister))
.post("/userlogin",tryCatchMiddleware(userController.userLogin))
.use(verifyToken)
.get("/viewproduct",tryCatchMiddleware(userController.viewProduct))
.get("/products/:id",tryCatchMiddleware(userController.productById))
.post("/addcart/:id",tryCatchMiddleware(userController.addToCart))
.get("/viewcart/:id", tryCatchMiddleware(userController.viewCartProduct))
.post("/addtowishlist/:id", tryCatchMiddleware(userController.addwishlist))
.get("/showwishlist/:id", tryCatchMiddleware(userController.showWishLIst))
.delete("/deletewishlist/:id",tryCatchMiddleware(userController.delete))
.post("/:id/payment",tryCatchMiddleware(userController.payment))
.get("/payment/success",tryCatchMiddleware(userController.success))
.get("/orderdetails/:id",tryCatchMiddleware(userController.orderDetails))


module.exports = router
