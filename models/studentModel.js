const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const studentModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [4, "First Name Should be atleast4 character long"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      minLength: [4, "Last Name Should be atleast4 character long"],
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      maxLength: [10, "Contact must not exceed 10 character"],
      minLength: [4, "Contact should be atleast 4 character long"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      minLength: [3, "City should be atleast 3 character long"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      maxLength: [15, "Password should not exceed more than 15 characters"],
      minLength: [6, "Password should have atleast  6 characters"],
      // match:[]
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },
    avatar: {
      type:Object,
      default:{
        fileId:"",
        url:"https://plus.unsplash.com/premium_photo-1669674583837-345867b97c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
      }
    },
    resume:{
      education:[],
      jobs:[],
      internships:[],
      responsibilities:[],
      courses:[],
      projects:[],
      skills:[],
      accomplishments:[]
    },
    internships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "internship",
      },
    ],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
      },
    ],

  },
  { timestamps: true }
);

studentModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

studentModel.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

studentModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const student = mongoose.model("student", studentModel);
module.exports = student;
