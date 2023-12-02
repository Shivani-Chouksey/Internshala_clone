const express=require("express");
const router=express.Router()

const { homepage ,employeSignup,employesignout,employesignin,currentEmploye,employesendmail,employeforgetlink,employeresetpasssword,employeupdate,employeavtar,createInternship,readInternship,readSingleInternship,createjob,readjob,readSinglejob} = require("../controllers/employeController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/",isAuthenticated,homepage)




//post /employe/signup
router.post("/signup",employeSignup)


//POST /current employe
router.post("/current",isAuthenticated,currentEmploye)



// //post /employe/signin
router.post("/signin",employesignin)

// //post /employe/signup
router.get("/signout",isAuthenticated ,employesignout)


//post /employe/send-mail
router.post("/send-mail" ,employesendmail)

//get /employe/forget-link/:employeid
router.post("/forget-link/" ,employeforgetlink)

//get /employe/reset-password/:employeid
router.post("/reset-password/:id",isAuthenticated ,employeresetpasssword)

//get /employe/update/:employeid
router.post("/update/:id",isAuthenticated ,employeupdate)

//get /employe/update/:employeid
router.post("/avtar/:id",isAuthenticated ,employeavtar)




// -------------------------internship route-------------------------------

//post /employe/interenship/create
router.post("/interenship/create",isAuthenticated ,createInternship)

//get /employe/interenship/read
router.get("/internship/read",isAuthenticated ,readInternship)

//get /employe/interenship/read/:id
router.get("/internship/read/:id",isAuthenticated ,readSingleInternship)






// -------------------------job route-------------------------------

//post /employe/job/create
router.post("/job/create",isAuthenticated ,createjob)

//get /employe/job/read
router.get("/job/read",isAuthenticated ,readjob)

//get /employe/job/read/:id
router.get("/job/read/:id",isAuthenticated ,readSinglejob)






module.exports=router