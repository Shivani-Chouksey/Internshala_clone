const ErrorHandler = require("../helpers/ErrorHandler");
const { catchAsyncerror } = require("../middleware/catchAsyncerror");
const Student = require("../models/studentModel");
const { sendtoken } = require("../helpers/SendToken");
const { sendmail  } = require("../helpers/nodemailer");
const imagekit = require("../helpers/imageKit").initImageKit();
const path = require("path");
const Internship = require("../models/internshipModel");
const Job = require("../models/jobModel");

exports.homepage = catchAsyncerror(async (req, res, next) => {
  res.json({ message: "Secure home page" });
});

exports.studentsignup = catchAsyncerror(async (req, res, next) => {
  const student = await new Student(req.body).save();
  sendtoken(student, 201, res);
  // res.status(201).json(student);
});

exports.currentStudent = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).populate("internships").populate("jobs").exec();
  res.json({ student });
});

exports.studentsignin = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!student)
    return next(
      new ErrorHandler("User Not Found with this Email address", 404)
    );

  const isMatch = student.comparePassword(req.body.password);

  if (!isMatch) return next(new ErrorHandler("Wrong Crediential", 500));
  sendtoken(student, 201, res);

  // res.json(student);
});

exports.studentsignout = catchAsyncerror(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "SuccessFully sign out" });
});

exports.studentsendmail = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email });

  if (!student)
    return next(
      new ErrorHandler("User Not Found with this Email address", 404)
    );


    const url=Math.floor(Math.random() * 9000 +1000);

  //make url link for send mail
  // const url = `${req.protocol}//${req.get("host")}/student/forget-link/${
  //   student._id
  // }`;

  sendmail(req, res, next, url);
  student.resetPasswordToken = `${url}`;
  // student.resetPasswordToken = "1";
  await student.save();
  res.json({ message:"mail send Successfully Check inbox/spam"});
});

// exports.studentforgetlink = catchAsyncerror(async (req, res, next) => {
//   const student = await Student.findOne({email:req.body.email}).exec();

//   if (!student)
//     return next(
//       new ErrorHandler("User Not Found with this Email address", 404)
//     );


//     const url=Math.floor(Math.random() * 9000 +1000);

//     sendmail(req, res, next)
//   if (student.resetPasswordToken == "1") {
//     student.resetPasswordToken = "0";
//     student.password = req.body.password;
//     await student.save();
//   } else {
//     return next(new ErrorHandler("Reset password link is invalid", 500));
//   }

//   res.status(200).json({ message: "Password has been successfully changed" });
// });
exports.studentforgetlink = catchAsyncerror(async (req, res, next) => {
  // console.log("password",req.body)
  const student = await Student.findOne({email:req.body.email}).exec();

  if (!student)
    return next(
      new ErrorHandler("User Not Found with this Email address", 404)
    );

  if (student.resetPasswordToken == req.body.otp) {
    student.resetPasswordToken = "0";
    student.password = req.body.password;
    await student.save();
  } else {
    return next(new ErrorHandler("Reset password link is invalid", 500));
  }

  res.status(200).json({ message: "Password has been successfully changed" });
});
// exports.studentforgetlink = catchAsyncerror(async (req, res, next) => {
//   const student = await Student.findById(req.params.id).exec();

//   if (!student)
//     return next(
//       new ErrorHandler("User Not Found with this Email address", 404)
//     );

//   if (student.resetPasswordToken == "1") {
//     student.resetPasswordToken = "0";
//     student.password = req.body.password;
//     await student.save();
//   } else {
//     return next(new ErrorHandler("Reset password link is invalid", 500));
//   }

//   res.status(200).json({ message: "Password has been successfully changed" });
// });

exports.studentresetpasssword = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();


  student.password = req.body.password;
  await student.save();
  sendtoken(student, 201, res);
});

exports.studentupdate = catchAsyncerror(async (req, res, next) => {
  await Student.findByIdAndUpdate(req.params.id, req.body).exec();
  res
    .status(200)
    .json({ message: "student Successfully Updated", success: true });
});

exports.studentavtar = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  const file = req.files.avatar;
  const modifiedName = `resumebuilder-${Date.now()}${path.extname(file.name)}`;

  if(student.avatar.fileId !== ""){
    await imagekit.deleteFile(student.avatar.fileId)
  }


  const {fileId,url} = await imagekit.upload({
    file: file.data,
    fileName: modifiedName,
  });

  student.avatar={fileId,url}
student.save()
res.status(200).json({success:true, message: "Profile Updated" });

});

// ===========internship====================


exports.applyinternship = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  const internship=await Internship.findById(req.params.internshipid).exec()

  student.internships.push(internship._id)

  internship.students.push(student._id)

  await student.save();

  await internship.save()


  res.json({  student });
});
// ===========job====================


exports.applyjob = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  const job=await Job.findById(req.params.jobid).exec()

  student.jobs.push(job._id)

  job.students.push(student._id)

  await student.save();

  await job.save()


  res.json({ student });
});




//==========read all job ======================
exports.readalljobs=catchAsyncerror(async(req, res, next)=>{
  const jobs =await Job.find().exec();

  res.status(200).json({jobs})
})

//==========read all internship ======================
exports.readallintrn=catchAsyncerror(async(req, res, next)=>{
  const internship =await Internship.find().exec();

  res.status(200).json({internship})
})
 



// ===========job====================
