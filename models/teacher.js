require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const teacherSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isLoggedIn: Boolean,
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  },
  {
    timestamps: true,
  }
);

teacherSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
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
