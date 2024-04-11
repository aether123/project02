const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user[0].id);
});
passport.deserializeUser(async (id, done) => {
  let [foundUser, fields] = await User.promise().query(
    "select * from user where id=?",
    [id]
  );
  done(null, foundUser[0]);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入Google Strategy");
      try {
        let [foundUser, fields] = await User.promise().query(
          "select * from user where gmail=?",
          [profile.emails[0].value]
        );

        if (foundUser.length > 0) {
          console.log("已經註冊過");
          done(null, foundUser);
        } else {
          console.log("偵測到新用戶");
          let [insertedUser, insertFields] = await User.promise().query(
            "INSERT INTO user (name,googleID,gmail) VALUES (?, ?,?)",
            [profile.displayName, profile.id, profile.emails[0].value]
          );
          let [newUser, fields] = await User.promise().query(
            "SELECT * FROM user WHERE gmail = ?",
            [profile.emails[0].value]
          );
          console.log("創建成功");
          done(null, newUser);
        }
      } catch (e) {
        console.error("數據庫查詢出錯:", e);
        done(e, null);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        let [foundUser, fields] = await User.promise().query(
          "select * from user where mail=?",
          [username]
        );

        if (foundUser.length > 0) {
          let result = await bcrypt.compare(password, foundUser[0].password);
          if (result) {
            return done(null, foundUser);
          } else {
            return done(
              null,
              false,
              req.flash("error_messages", "帳號或密碼輸入錯誤")
            );
          }
        } else {
          return done(null, false, req.flash("error_messages", "沒註冊會員"));
        }
      } catch (e) {
        console.log("數據庫查詢出錯:", e);
        done(e);
      }
    }
  )
);
