require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const teacherSchema = new mongoose.Schema(
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
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    isLoggedIn: Boolean,
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

async function isUsernameUnique(username) {
  const count = await Teacher.countDocuments({ username });
  return count === 0 ? 1 : 0;
}
teacherSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  if (!(await isUsernameUnique(this.username))) {
    return next(new Error("Username must be unique"));
  }
  next();
});

teacherSchema.methods.generateAuthToken = async function () {
  this.isLoggedIn = true;
  await this.save();
  const token = jwt.sign({ _id: this._id }, process.env.SECRET);
  return token;
};

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
