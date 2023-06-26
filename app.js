const express = require("express");
const morgan = require("morgan");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const gradeRoutes = require("./routes/gradeRoutes");

const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);
app.use("/subjects", subjectRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/grades", gradeRoutes);

module.exports = app;
