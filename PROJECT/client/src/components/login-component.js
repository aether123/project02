import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/nav.css";
import "../styles/login.css";
import AuthService from "../services/auth_service";
const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [mail, setMail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  const handleMail = (e) => {
    setMail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = async () => {
    try {
      let response = await AuthService.login(mail, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/dietRecord");
    } catch (e) {
      setMessage(e.response.data);
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:8080/auth/google";
  };
  return (
    <div className="login">
      {message && (
        <div
          className="alert-danger"
          style={{
            border: "solid black 0.1px",
            backgroundColor: " #F75D59",
            fontSize: "1.25rem",
            padding: "0.3rem 1rem",
            margin: "0.5rem",
            borderRadius: "10px",
          }}
        >
          {message}
        </div>
      )}

      <div className="local-login">
        <div className="form-group">
          <label htmlFor="email">帳號:</label>
          <input
            onChange={handleMail}
            type="email"
            id="email"
            className="form-control"
            name="username"
            placeholder="輸入信箱"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼:</label>
          <input
            onChange={handlePassword}
            type="password"
            id="password"
            className="form-control"
            name="password"
            placeholder="輸入密碼"
          />
        </div>
        <br />
        <div className="form-group-btn" onClick={handleLogin}>
          <button className="btn">會員登入</button>
        </div>
      </div>
      <div className="btn-google">
        <button onClick={handleGoogleLogin}>
          <img src="https://img.icons8.com/color/16/000000/google-logo.png" />
          透過google登入
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
