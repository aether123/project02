const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

//npm install passport-google-oauth20
// 使用者透過local登入系統
router.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      let errorMessage = req.flash("error_messages")[0];
      return res.status(401).send(errorMessage);
    }
    return res.send({ message: "登入成功", user: user[0] });
  })(req, res, next);
});

//使用者註冊帳號
router.post("/signup", async (req, res) => {
  let { username, mail, password } = req.body;
  //確認帳號密碼是否符合規定
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (
    !emailRegex.test(mail) &&
    (password.length < 8 || !passwordRegex.test(password))
  ) {
    return res
      .status(400)
      .send(
        "信箱不符合規定格式，請確實填寫\n密碼長度要大於八位數\n密碼必須包含數字與英文\n密碼至少一位大寫英文"
      );
  } else if (!emailRegex.test(mail)) {
    return res.status(400).send("信箱不符合規定格式，請確實填寫");
  } else if (password.length < 8 || !passwordRegex.test(password)) {
    return res
      .status(400)
      .send(
        "密碼長度要大於八位數\n密碼必須包含數字與英文\n密碼至少一位大寫英文"
      );
  }

  //確認帳號是否被註冊過
  let [foundUser, fields] = await User.promise().query(
    "select * from user where mail=?",
    [mail]
  );
  if (foundUser.length > 0) {
    return res.status(400).send("帳號已經被註冊過");
  }

  let hashPassword = await bcrypt.hash(password, 12);
  try {
    let [newUser, insertFields] = await User.promise().query(
      "INSERT INTO user (name,mail,password) VALUES (?, ?,?)",
      [username, mail, hashPassword]
    );
    return res.send("儲存成功");
  } catch (e) {
    return res.status(500).send("無法儲存使用者");
  }
});

//google 登入畫面
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// google轉址到哪
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/dietRecord",
  })
);

//確認使用google auth是否登入成功
router.get("/login/sucess", async (req, res) => {
  return res.send({ message: "登入成功", user: req.user });
});

//google 登出
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return res.send(err);
    return res.redirect("http://localhost:3000");
  });
});

module.exports = router;
