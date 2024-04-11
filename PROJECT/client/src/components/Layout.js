import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

import AuthService from "../services/auth_service";

const Layout = ({ currentUser, setCurrentUser }) => {
  let [curUrl, setCurUrl] = useState("");
  const handleLogout = () => {
    //處理使用者登出狀態
    if (currentUser.user.height) {
      AuthService.logout();
      window.alert("登出成功");
      setCurrentUser(null);
      window.location.href = "http://localhost:8080/auth/logout";
    }
  };
  return (
    <>
      <nav>
        <ul className="navbar">
          {!currentUser && (
            <li className="nav-item">
              <Link className="nav-link" to="/">
                首頁
              </Link>
            </li>
          )}
          {!currentUser && (
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/registor"
                style={curUrl ? { color: "red" } : { color: "black" }}
              >
                註冊會員
              </Link>
            </li>
          )}
          {!currentUser && (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                會員登入
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link className="nav-link" to="/dietRecord">
                飲食日記
              </Link>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link className="nav-link" to="/dietHistory">
                飲食歷史紀錄
              </Link>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link className="nav-link" to="/userInfo">
                使用者資訊
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link onClick={handleLogout} className="nav-link" to="/">
                會員登出
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
