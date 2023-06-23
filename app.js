const express = require("express");
const morgan = require("morgan");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);

module.exports = app;
