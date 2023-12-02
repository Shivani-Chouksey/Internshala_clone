require('dotenv').config();
const cors=require("cors")
const express=require("express")
const app = express();



const logger=require("morgan");
app.use(logger("tiny"))


//db connection
require("./models/Connection").connection()


//body parser
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// Allow requests from any origin
app.use(cors({origin:true,credentials:true}));

//session and cookies
const session=require("express-session")
const cookieparser=require("cookie-parser")
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:process.env.EXPRESS_SESSION_SECRET
}))
app.use(cookieparser())



//expree-fileupload
const fileupload=require("express-fileupload");
app.use(fileupload())

//routes
app.use("/",require("./routes/indexRoutes"))
app.use("/resume",require("./routes/resumeRoutes"))
app.use("/employe",require("./routes/employeRoutes"))


// error handling 
const ErrorHandler = require("./helpers/ErrorHandler");
const { generatedError } = require('./middleware/error');
app.all("*",(req,res,next)=>{
    next(new ErrorHandler(`Requested URL Not Found  ${req.url}`,404))
})

app.use(generatedError)
app.listen(process.env.PORT,console.log(`server is running on port ${process.env.PORT}`))