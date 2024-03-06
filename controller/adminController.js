// const mongoose = require('mongoose');
// const jwt = require("jsonwebtoken")
// const Users = require("../Modles/UserSchema")
// const UsersSchema = require("../Modles/UserSchema")
// const {joiproductSchema} = require("../Modles/validationSchema")
// const products = require("../Modles/ProductSchema");
// const { date } = require('joi');
// const OrderSchema = require('../Modles/OrderSchema');

// module.exports = {
//     login: async(req,res) =>{
//         const {email,password} = req.body;
        
//         if(
//             email == process.env.ADMIN_EMAIL &&
//             password == process.env.ADMIN_PASSWORD
//         ){
//             const token = jwt.sign(
//                 {email:email},
//                 process.env.ADMIN_ACCESS_TOKEN_SECRET
//             );


//             return res.status(200).send({
//                 status:"success",
//                 message:"admin registration successfully",
//                 data:token
//             });
//         }else{
//             return res.status(404).json({
//                 status:"error",
//                 message:" this is not an admin"
//             });
//         }
//     },

//     // to find all users


//     allUser:async(req,res) =>{
//         const allUser = await UsersSchema.find();


//         if(allUser.length === 0){
//             return res.status(404).json({
//                 status:"error",
//                 message:" user not found"
//             })
//         }

//         res.status(200).json({
//             status:"successfully",
//             message:"successfully fetched user data",
//             data:allUser,
//         })
//     },

//     // specific user

//     userById:async(req,res) =>{
//         const userId=req.params.id;
//         const user = await Users.findById(userId)

//         if(!user){
//             return res.status(404).json({
//                 status:"error",
//                 message:"user not found"
//             });
//         }


//         res.status(200).send({
//             status:"success",
//             message:"successfully find user",
//             data :user
//         })
//     },

//     // to create product

//     createProduct:async(req,res) =>{
//         const {value,error} = joiproductSchema.validate(req.body);

//         const {title,description,price,image,category} = value;
//         console.log(value);
//         if(error) {
//             return res.status(400).json({error:error.message});
//         }else{
//             await products.create({
//                 title,
//                 description,
//                 price,
//                 image,
//                 category
//             });

//             res.status(201).json({
//                 status:"success",
//                 message:"successfully created products",
//                 data:products,

//             })
//         }
//     },

//     // view all product


//     allProduct:async(req,res) =>{
//         const prods = await products.find()
//         console.log(prods)

//         if(!prods){
//             return(
//                 res.status(404),
//                 send({
//                     status:"error",
//                     message:"products not found",
//                 })
//             );

//         }
//         res.status(200).json({
//             status:"success",
//             message:"successfully fetched the product details",
//             data:prods,
//         })    
//     },


//     // product by id

//     productById:async(req,res) =>{
//         const productId = req.params.id;
//         const product = await products.findById(productId)

//         if(!product){
//             return res.status(404).send({
//                 status:"error",
//                 message:"product not found"
//             });
//         }
//         res.status(200).json({
//             status:"success",
//             message:"successfully fetched product details",
//             data:product
//         });
//     },



//     // delete products

//     deleteProduct: async (req, res) => {
//         const { id: productId } = req.params;
//         if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
//           return res.status(400).json({
//             status: "failure",
//             message: "invalid product id",
//           });
//         }
//         try {
//           const deletedProduct = await products.findOneAndDelete({
//             _id: productId,
//           });
//           if (!deletedProduct) {
//             return res
//               .status(404)
//               .json({
//                 status: "failure",
//                 message: "product not found in database",
//               });
//           }
//           return res
//             .status(200)
//             .json({ status: "success", message: "product deleted successfully" });
//         } catch (error) {
//           return res
//             .status(500)
//             .json({
//               status: "failure",
//               message: "error",
//               error_message: error.message,
//           });
//     }
//     },

//     // update product

//     updateProduct: async (req, res) => {
        
//         try {
//             const { value, error } = joiproductSchema.validate(req.body);
        
    
//             const {id,title,description,price,image,category} = value;
//             // console.log(title)
//             if (error) {
//                 return res.status(401).json({ status: 'error', message: error.details[0].message });  
//             }
    
        
//             const updatedProduct = await products.findByIdAndUpdate(
//                 id,
//                 { $set: { title, description, price, image, category } },
//                 { new: true } // This option returns the modified document rather than the original
//             );
//             console.log(updatedProduct)
    
//             if (updatedProduct) {
//                 const updatedProducts = await products.findById(id); 
//                 return res.status(200).json({
//                     status: 'success',
//                     message: 'Successfully updated the product.',
//                     data: updatedProducts,
//                 });
//             } else {
//                 return res.status(404).json({ status: 'error', message: 'Product not found' });
//             }
//         } catch (error) {
//             console.error('Error updating product:', error);
//             return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//         }
//     },


//     // admin view order details

//     AdminorderDetails : async(req,res) =>{
//         const products = await OrderSchema.find()

//         if(products.length === 0){
//             return res.status(404).json({
//                 status:"error",
//                 message:"no order details found",
//             })
//         }

//         res.status(200).json({
//             status:"success",
//             message:"order details successfully fetched",
//             order_data : products
//         })
//     },

//     revenuestatus:async(req,res) =>{
//         const totalRevenue = await OrderSchema.aggregate([
//             {$group:{
//                 _id:null,
//                 totalproduct:{$sum:
//                 {$size:"$products"}},
//                 totalRevenue:{$sum:"$total_amount"},
//             }}
//         ])

//         if(totalRevenue.length>0){
//             res.status(200).json({
//                 status:"success",
//                 data:totalRevenue[0]
//             })
//         }else{
//             res.status(200).json({
//                 status:"success",
//                 data:{totalproduct:0,
//                 totalRevenue:0}
//             })
//         }
//     }
    

    
// }