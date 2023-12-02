const jwt=require("jsonwebtoken");
const ErrorHandler=require("../helpers/ErrorHandler");
const { catchAsyncerror } = require("./catchAsyncerror");




exports.isAuthenticated=catchAsyncerror(async(req,res,next)=>{
    const {token}=req.cookies 


    if(!token){
return next(new ErrorHandler("please login to acceess the resources ",401))
    }
    const {id}=jwt.verify(token,process.env.JWT_SECRET)
req.id=id
    // res.json({token,id})
    next()

})