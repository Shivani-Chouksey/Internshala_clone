const nodemailer=require("nodemailer")
const ErrorHandler = require("./ErrorHandler")



exports.sendmail=(req,res,next,url)=>{
const transport=nodemailer.createTransport({
    service:"email",
    host:"smtp.gmail.com",
    post:465,
    auth:{
        user:process.env.MAIL_EMAIL_ADDRESS,
        pass:process.env.MAIL_PASSWORD
    }
})

const mailoptions={
    from:"shivani private limited",
    to:req.body.email,
    subject:"Password rests link",
    // text:"Do not share this link to anyone"
    html:`<h1>Click link blow to reset password </h1>
    <h1>${url} </h1>
   `

}

transport.sendMail(mailoptions,(err,info)=>{
    if(err)return  next(
        new ErrorHandler(err,500)
      )
      console.log(info); 
      return res.status(200).json({message:"mail send successfully",url})
})
}