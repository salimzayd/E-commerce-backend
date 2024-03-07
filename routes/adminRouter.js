const express = require("express");
const router = express.Router()
const admin = require("../controller/adminController");
const verifyToken = require("../middlewares/adminAuthMiddleware")

const tryCatchMiddleware = require("../middlewares/trycatch")
const imageUpload = require("../middlewares/imageUpload/imageUpload")
const adminController = require("../controller/adminController")


router 

.post("/login",tryCatchMiddleware(admin.login))
.use(verifyToken)
.get("/users",tryCatchMiddleware(admin.allUser))
.get("/users/:id",tryCatchMiddleware(admin.userById))
.post("/products",imageUpload,tryCatchMiddleware(admin.createProduct))
.get("/allproducts",tryCatchMiddleware(admin.allProduct))
.delete("/deleteproducts/:id",tryCatchMiddleware(admin.deleteProduct))
.get("/productbyid/:id",tryCatchMiddleware(admin.productById))
.put("/productsupdate/:id",tryCatchMiddleware(admin.updateProduct))
.get("/orderdetails",tryCatchMiddleware(adminController.AdminorderDetails))
.get("/revenuestatus",tryCatchMiddleware(adminController.revenuestatus))


module.exports = router