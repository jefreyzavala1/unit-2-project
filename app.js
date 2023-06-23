const express = require("express");
const morgan = require("morgan");
const teacherRoutes = require("./routes/teacherRoutes");
const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use("/teachers", teacherRoutes);

module.exports = app;
