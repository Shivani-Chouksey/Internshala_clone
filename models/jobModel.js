const mongoose = require("mongoose");

const jobModel = new mongoose.Schema(
  {
    employe:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "employe",
      },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      }],
    tittle: String,
    skill: String,
    jobtype: { type: String, enum: ["In office", "remote"] },
    openings: Number,
    description: String,
    preferences: String,
    salary: Number,
    perks: String,
    assements: String,
  },
  { timestamps: true }
);

const job = mongoose.model("job", jobModel);
module.exports = job;
