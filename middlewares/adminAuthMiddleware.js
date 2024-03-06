const jwt = require('jsonwebtoken')

module.exports = function verifyToken(req,res,next) {
    const token = req.headers["authorization"]
    console.log("token",token)



    if(!token){
        return res.status(403).json({erorr:"no token provided"})
    }


    jwt.verify(token,process.env.ADMIN_ACCESS_TOKEN_SECRET,(err,decoded) =>{
        if(err){
            return res.status(403).json({error:"unauthorized"})
        }

        req.email = decoded.email

        next()
    })
}