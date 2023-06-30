require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is require"],
      unique: true,
      trim: true,
    },
    isLoggedIn: Boolean,

    password: { type: String, required: [true, "Password is required"] },
    className: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },
    listOfAssignments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    ],
    listOfSubmissions:[]
  },
  {
    timestamps: true,
  }
);

studentSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

studentSchema.methods.generateAuthToken = async function () {
  this.isLoggedIn = true;
  await this.save();
  const token = jwt.sign({ _id: this._id }, process.env.SECRET);
  return token;
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
