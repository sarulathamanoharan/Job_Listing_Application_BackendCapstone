const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

const fs = require("fs");
const path = require("path");
const logStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
const errorStream = fs.createWriteStream(path.join(__dirname, "error.txt"), {
  flags: "a",
});

const authRoutes = require("./routes/auth"); //importing auth.js file
const jobRoutes = require("./routes/job"); //importing job.js file

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const now = new Date();
  const time = `${now.toLocaleTimeString()}`;
  console.log(req.originalUrl, time);
  const log = `${req.method} ${req.originalUrl} ${time}`;
  logStream.write(log + "\n");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  const now = new Date();
  const time = `${now.toLocaleTimeString()}`;
  console.log(req.originalUrl, time);
  const error = `${req.method} ${req.originalUrl} ${time}`;
  errorStream.write(error + "\n");
  res.status(404).send("Routes not found.");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
