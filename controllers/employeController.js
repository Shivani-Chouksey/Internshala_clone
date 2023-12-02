const ErrorHandler = require("../helpers/ErrorHandler");
const { catchAsyncerror } = require("../middleware/catchAsyncerror");
const Employe = require("../models/employeModel");
const { sendtoken } = require("../helpers/SendToken");
const { sendmail  } = require("../helpers/nodemailer");
const imagekit = require("../helpers/imageKit").initImageKit();
const path = require("path");
const Internship = require("../models/internshipModel");
const Job = require("../models/jobModel");

exports.homepage = catchAsyncerror(async (req, res, next) => {
  res.json({ message: "Secure Employe home page" });
});

exports.employeSignup = catchAsyncerror(async (req, res, next) => {
  const employe = await new Employe(req.body).save();
  sendtoken(employe, 201, res);
  // res.status(201).json(student);
});

exports.currentEmploye = catchAsyncerror(async (req, res, next) => {
  const employe = await Employe.findById(req.id).populate("internships").populate("jobs").exec();
  res.json({ employe });
}); 

// exports.currentEmploye = catchAsyncerror(async (req, res, next) => {
exports.employesignin = catchAsyncerror(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!employe)
    return next(
      new ErrorHandler("Employe Not Found with this Email address", 404)
    );

  const isMatch = employe.comparePassword(req.body.password);

  if (!isMatch) return next(new ErrorHandler("Wrong Crediential", 500));
  sendtoken(employe, 201, res);

  // res.json(student);
});

exports.employesignout = catchAsyncerror(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "SuccessFully sign out" });
});

exports.employesendmail = catchAsyncerror(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email });

  if (!employe)
    return next(
      new ErrorHandler("User Not Found with this Email address", 404)
    );

    //send otp 
    const url=Math.floor(Math.random() * 9000 +1000);

  // //make url link for send mail
  // const url = `${req.protocol}//${req.get("host")}/employe/forget-link/${
  //   employe._id
  // }`;

  sendmail(req, res, next, url);
  employe.resetPasswordToken = `${url}`;
  // employe.resetPasswordToken = "1";
  await employe.save();
  res.json({ employe, url });
});

exports.employeforgetlink = catchAsyncerror(async (req, res, next) => {
  const employe = await Employe.findOne({email:req.body.email}).exec();
  // const employe = await Employe.findById(req.params.id).exec();
  if (!employe)
    return next(
      new ErrorHandler("User Not Found with this Email address", 404)
    );

  if (employe.resetPasswordToken ==  req.body.otp) {
    employe.resetPasswordToken = "0";
    employe.password = req.body.password;
    await employe.save();
  } else {
    return next(new ErrorHandler("Reset password link is invalid", 500));
  }

  res.status(200).json({ message: "Password has been successfully changed" });
});

exports.employeresetpasssword = catchAsyncerror(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  employe.password = req.body.password;
  await employe.save();

  sendtoken(employe, 201, res);
  res
      .status(200)
      .json({ message: "employe password Successfully  Updated", success: true });

});

exports.employeupdate = catchAsyncerror(async (req, res, next) => {
  await Employe.findByIdAndUpdate(req.params.id, req.body).exec();
  res
    .status(200)
    .json({ message: "employe Successfully Updated", success: true });
});

exports.employeavtar = catchAsyncerror(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();
  const file = req.files.organizationlogo;
  const modifiedName = `resumebuilder-${Date.now()}${path.extname(file.name)}`;

  if(employe.organizationlogo.fileId !== ""){
    await imagekit.deleteFile(employe.organizationlogo.fileId)
  }


  const {fileId,url} = await imagekit.upload({
    file: file.data,
    fileName: modifiedName,
  });

  employe.organizationlogo={fileId,url}
employe.save()
res.status(200).json({success:true, message: "Profile Updated" });

});


// ------------------internship-------------------------------


exports.createInternship=catchAsyncerror(async(req,res,next)=>{

  const employe = await Employe.findById(req.id).exec();
// console.log(employe)

  const internship=await new Internship(req.body).save()

  internship.employe = employe._id ;

  employe.internships.push(internship._id)

  await internship.save()
  await employe.save()
  res.status(201).json({success:true,internship})

})

exports.readInternship=catchAsyncerror(async(req,res,next)=>{

  const {internships} = await Employe.findById(req.id).populate("internships").exec();


  res.status(200).json({success:true,internships})

})

exports.readSingleInternship=catchAsyncerror(async(req,res,next)=>{

const internship =await Internship.findById(req.params.id).exec()

  res.status(200).json({success:true,internship})

})


// ------------------job-------------------------------


exports.createjob=catchAsyncerror(async(req,res,next)=>{

  const employe = await Employe.findById(req.id).exec();

  const job=await new Job(req.body).save()

  job.employe = employe._id ;

  employe.jobs.push(job._id)

  await job.save()
  await employe.save()
  res.status(201).json({success:true,job})

})

exports.readjob=catchAsyncerror(async(req,res,next)=>{

  const {jobs} = await Employe.findById(req.id).populate("jobs").exec();


  res.status(200).json({success:true,jobs})

})

exports.readSinglejob=catchAsyncerror(async(req,res,next)=>{

const job =await Job.findById(req.params.id).exec()

  res.status(200).json({success:true,job})

})