const ErrorHandler = require("../helpers/ErrorHandler");
const { catchAsyncerror } = require("../middleware/catchAsyncerror");
// const student = require("../models/studentModel");
const Student = require("../models/studentModel");

// const Student = require("../models/studentModel");
const { v4: uuidv4 } = require("uuid");




//====================================== education controllers===============================

exports.resume = catchAsyncerror(async (req, res, next) => {
  const { resume } = await Student.findById(req.id).exec();
  console.log(req.id);
  res.json({ message: "Secure Resume home page ", resume });
});

exports.addeducation = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  student.resume.education.push({ ...req.body, id: uuidv4() });
  await student.save();
  res.json({ message: "Education Added " });
});

exports.editeducation = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  const eduIndex = student.resume.education.findIndex(
    (i) => i.id === req.params.eduid
  );

  student.resume.education[eduIndex] = {
    ...student.resume.education[eduIndex],
    ...req.body,
  };
  await student.save();
  res.json({ message: "Education Updated ! " });
});

exports.deleteEducation = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  const filterededu = student.resume.education.filter(
    (i) => i.id !== req.params.eduid
  );

  student.resume.education = filterededu;
  await student.save();
  res.json({ message: "Education Deleted ! " });
});




//====================================== job controllers===============================


exports.job = catchAsyncerror(async (req, res, next) => {
  const { jobs } = await Student.findById(req.id).exec();
  console.log(req.id);
  res.json({ message: "Secure JOb home page ", jobs });
});



exports.addjob = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  student.resume.jobs.push({ ...req.body, id: uuidv4() });
  await student.save();
  res.json({ message: "Job Added " });
});


exports.editjob = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  const jobIndex = student.resume.jobs.findIndex(
    (i) => i.id === req.params.jobid
  );

  student.resume.jobs[jobIndex] = {
    ...student.resume.jobs[jobIndex],
    ...req.body,
  };
  await student.save();
  res.json({ message: "Job Updated ! " });
});


exports.deletejob = catchAsyncerror(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();

  const filteredjob = student.resume.jobs.filter(
    (i) => i.id !== req.params.jobid
  );

  student.resume.jobs = filteredjob;
  await student.save();
  res.json({ message: "Job Deleted ! " });
});

