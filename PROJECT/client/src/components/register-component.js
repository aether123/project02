import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import AuthService from "../services/auth_service";

const RegisterCcomponent = () => {
  let navigate = useNavigate();

  let [username, setUsername] = useState(""); //記錄使用者名稱
  let [mail, setMail] = useState(""); //紀錄mail
  let [password, setPassword] = useState(""); //紀錄密碼
  let [errorMessage, setErrorMessage] = useState(""); //紀錄密碼錯誤訊息

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleMail = (e) => {
    setMail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let res = await AuthService.register(username, mail, password);
      window.alert("註冊成功，導向登入頁面");
      navigate("/login");
    } catch (e) {
      setErrorMessage(e.response.data);
    }
  };

  return (
    <div className="register">
      <div className="form">
        <div className="form-group">
          <label htmlFor="username">姓名：</label>
          <input
            onChange={handleUsername}
            type="text"
            id="username"
            className="form-control"
            name="username"
            placeholder="輸入姓名"
            required
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="mail">信箱：</label>
          <input
            onChange={handleMail}
            type="text"
            id="mail"
            className="form-control"
            name="mail"
            placeholder="輸入信箱地址"
            required
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            id="password"
            className="form-control"
            name="password"
            placeholder="輸入密碼"
            required
          />
        </div>
        <br />
        <button className="btn" onClick={handleRegister}>
          註冊會員
        </button>
      </div>

      <div>
        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage.split("\n").map((line, index) => (
              <div
                key={index}
                className="alert alert-danger"
                style={{ padding: "0.3rem 0.5rem" }}
              >
                {line}
                <br />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterCcomponent;
