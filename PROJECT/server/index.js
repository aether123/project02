// npm install express mongoose dotenv passport
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-rout");
const dietRoutes = require("./routes/diet-rout");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/auth", authRoutes);
app.use("/diet", dietRoutes);
app.get("/test", (req, res) => {
  return res.send("ok");
});

app.listen(8080, () => {
  console.log("正在監聽8080port ");
});
