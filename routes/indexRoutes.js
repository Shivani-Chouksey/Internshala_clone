const express=require("express");
const router=express.Router()

const { homepage ,studentsignup,studentsignout,studentsignin,currentStudent,studentsendmail,studentforgetlink,studentresetpasssword,studentupdate,studentavtar,applyinternship,applyjob,readalljobs,readallintrn} = require("../controllers/indexControllers");
const { isAuthenticated } = require("../middleware/auth");

router.get("/",homepage)




//post /student/signup
router.post("/student/signup",studentsignup)


//POST /student
router.post("/student",isAuthenticated,currentStudent)



//post /student/signup
router.post("/student/signin",studentsignin)

//post /student/signup
router.get("/student/signout",isAuthenticated ,studentsignout)


//post /student/send-mail
router.post("/student/send-mail" ,studentsendmail)

//post /student/forget-link/:studentid
router.post("/student/forget-link/" ,studentforgetlink)

//get /student/reset-password/:studentid
router.post("/student/reset-password/:id",isAuthenticated ,studentresetpasssword)

//get /student/update/:studentid
router.post("/student/update/:id",isAuthenticated ,studentupdate)

//get /student/update/:studentid
router.post("/student/avtar/:id",isAuthenticated ,studentavtar)



// ==============applyinternship========================

//get /student/apply/:internshipid
router.post("/student/apply/internship/:internshipid",isAuthenticated ,applyinternship)


// ==============applyjob========================

// get /student/apply/:jobid
router.post("/student/apply/job/:jobid",isAuthenticated ,applyjob)

// ==============read all internship========================

//post /student/allinternships
router.get("/student/allinternships/",isAuthenticated ,readallintrn)


// ==============applyjob========================

// get /student/apply/:jobid
router.get("/student/alljobs",isAuthenticated ,readalljobs)

module.exports=router