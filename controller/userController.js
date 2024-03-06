const bcrypt = require('bcrypt');
const User = require("../Modles/UserSchema");
const {joiUserSchema} = require("../Modles/validationSchema");
const jwt = require('jsonwebtoken');
const products = require('../Modles/ProductSchema');
const {default:mongoose} = require("mongoose");
const { default: Stripe } = require('stripe');
const stripe = require('stripe')(process.env.stripe_secret);
let sValue = {};
const order = require("../Modles/OrderSchema")


module.exports = {
    userRegister:async(req,res)=>{
        const {value,error} = joiUserSchema.validate(req.body);
        const {name,email,username,password} = value;
        const hashedPassword = await bcrypt.hash(password,10)

        if(error){
            res.status(400).json({
                status:"error",
                message:"invalid user,please check data"
            });
        }

        // name vechitt user already exist ahno nn check cheyyanm??

        const existingUser = await User.findOne({ name: name });

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "User with this name already exists"
            });
        }
        
        await User.create({
            name: name,
            email: email,
            username: username,
            password: hashedPassword
        });
        
        return res.status(201).json({
            status: "success",
            message: "User registration successful"
        });

    },

    userLogin:async(req,res) =>{
    const {value,error} = joiUserSchema.validate(req.body);
    if(error){
        res.json(error.message);
    }


    const {username,password} = value;
    const user = await User.findOne({
        username:username
    });
    console.log(username)
   
    

    if(!user){
         res.status(404).json({
            status:"error",
            message:"user not found"
        });
    }

    if(!password || !user.password){
        return res.status(404).json({
            status:"error",message:"invalid input"
        });
    }


    const passwordMatch = await bcrypt.compare(password,user.password);
    if(!passwordMatch){
        return res.status(401).json({
            error:"error",
            message:"incorrect password"
        });
    }


    const token = jwt.sign(
        {username:user.username},
        process.env.USER_ACCESS_TOKEN_SECRET,
        {
            expiresIn:86400,
        }
    );

    res.status(200).json({
        status:"success",
        message:"Login successful",Token:token
    })
},

// user view all products  


viewProduct : async(req,res) =>{
    const product = await products.find();

    if(!product){
        res.status(404).send({status:"error",message:"product not found"});

    }

    res.status(200).send({
        status:"success",
        message:"successfully fetched data",
        data:product
    });
},

// specific product

    productById:async(req,res) =>{
        const productId = req.params.id;
        const prod = await products.findById(productId);

        if(!prod){
            return res.status(404).json({
                status:"error",
                message:"product not found"
            });
        }
        res.status(200).json({
            status:"success",
            data:prod
        })

    },
        // add to cart

        addToCart:async(req,res) =>{
            const userId= req.params.id;
            const user = await User.findById(userId);
            console.log(user)

            if(!user){
                return res.status(404).send({
                    status:"failed",
                    message:"user not found",
                });
            }


            const {productId} = req.body;
            
        
        if(!productId){
            return res.status(404).send({
                status:"failed",
                message:"product not found"
            });
        }

       const newprod= await User.updateOne({_id:userId},{$addToSet:{cart:productId}});
        res.status(200).send({
            status:"success",
            message:"successfully product was added to cart",
            data:newprod
        
        });

    },
    // cart view

    viewCartProduct:async(req,res) =>{
        const userId = req.params.id;
        const user = await User.findById(userId);


        if(!user){
            return res.status(404).json({
                status:"failed",
                message:"user not found"
            })
        }

        const cartProductId = user.cart;
        
        if(cartProductId.length === 0){
            return res.status(200).json({
                status:"success",
                message:"cart is empty",
                data:[]
            })
        }

        const cartProducts = await products.find({_id:{$in:cartProductId}});
        res.status(200).json({
            status:"success",
            message:"cart products fetched successfully",
            data:cartProducts
        });


    },

    // add to wishlist

    addwishlist:async(req,res) =>{
        const userId = req.params.id;
        if(!userId){
            return res.status(404).json({
                status:"failure",
                message:"user not found"
            })
        }

        const {productId} = req.body;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                status:"failure",
                message:"no product found"
            })
        }

        const findprod = await User.findOne({_id: userId,wishlist:productId});

        if(findprod){
            return res.status(404).json({
                status:"failure",
                message:"product already in the wishlist"
            });
        }

        const updateResult = await User.updateOne({_id: userId},{$push: {wishlist: productId}});
        console.log(updateResult,"ww")

    

        return res.status(201).json({
            status:"success",
            message:"product successfully added to wishlist",
            data:updateResult
        });
    },

    showWishLIst:async (req,res)=>{
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                status:"failed",
                message:"user not found"
            })
        }

        const wishProdId = user.wishlist;
        if(wishProdId.length === 0){
            return res.status(200).json({
                status:"success",
                message:"user wishlist is empty",data:[]
            })
        }

        const wishProducts = await products.find({_id:{$in:wishProdId}});
        res.status(200).json({
            status:"success",
            message:"wishlist product fetched successfully",
            data:wishProducts
        });
    },

    delete: async(req,res) =>{
        const userId = req.params.id;
        const {productId} = req.body;

        if(!productId){
            return res.status(400).json({
                message:"product not found"
            });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }

        await User.updateOne({_id:userId},{$pull:{wishlist:productId}});
        res.status(200).json({message:"successfully romoved from wislist"})
    },

    // payment

    payment:async(req,res) =>{
        const userId= req.params.id;
        const user = await User.findOne({_id:userId}).populate("cart");

        if(!user){
            return res.status(404).json({
                message:"user not found"
            });
        }

        const cartProducts = user.cart

        if(cartProducts.length === 0){
            return res.status(200).json({status:"success",message:"cart is empty",data:[]})
        }


        const lineItems = cartProducts.map((item) =>{
            return{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:item.title,
                        description:item.description
                    },
                    unit_amount:Math.round(item.price*100),
                },
                quantity:1,
            };
        });


        session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:`http://localhost:3004/api/users/payment/success`
        });

        if(!session){
            return res.json({
                status:"failure",
                message:"error occured on session side",
            });
        }

        sValue={
            userId,
            user,
            session,
        };

        res.status(200).json({
            status:"success",
            message:"strip payment session created",
            url:session.url,
        });
    },


    success: async(req,res) =>{
        const {userId,user,session} = sValue;
        console.log(sValue,"qwer")
        console.log(user);

        // const userId = user._id;
        const cartItems =user.cart;
        console.log(cartItems);

        const orders = await order.create({
            userId:userId,
            products:cartItems.map(
                (value) => new mongoose.Types.ObjectId(value._id),
            ),
            order_id: session.id,
            payment_id:`demo ${Date.now()}`,
            total_amount:session.amount_total / 100,
        });
        console.log('orderr',orders)

        if(!orders){
            return res.json({message:"error occured while inputing to orderDB"});
        }

        const orderId = orders._id

        const userUpdate = await User.findOneAndUpdate(
            {_id:userId},
            {$push:{orders:orderId},
            $set:{cart:[]},
        },
        {new:true}
        );
        console.log(userUpdate);

        if(userUpdate){
            res.status(200).json({
                status:"success",
                message:"payment successfull",
            });
        }else{
            res.status(500).json({
                status:"error",
                message:"failed to update user data"
            })
        }
    },

    orderDetails: async(req,res) =>{
        const userId = req.params.id;
        
        const user = await User.findById(userId).populate("orders");

        if(!user){
            return res.status(400).json({
                status:"failed",
                message:"user not found",
            });
        }

        const orderProducts = user.orders;

        if(orderProducts.length === 0){
            return res.status(200).json({
                message:"you don't have ant product in orders",
                data:[]
            })
        }

        const orderWithProducts = await order.find({_id: {$in:orderProducts}}).populate("product");

        res.status(200).json({
            message:"ordered products details found",
            data:orderWithProducts
        });
    }
 }

