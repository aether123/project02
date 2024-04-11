import React, { useState, useEffect } from "react";
import "../styles/userInfo.css";
const UserInfoComponent = ({ currentUser, setCurrentUser }) => {
  //記錄使用者資訊
  let [userInfo, setUserInfo] = useState({
    username: "",
    gender: "",
    birthdate: "",
    hieght: "",
    weight: "",
    activityLevel: "",
    highProteinDiet: "",
  });

  //修改使用者狀態
  useEffect(() => {
    const getUser = () => {
      let userInfo = currentUser.user;
      setUserInfo({
        ...userInfo,
        username: userInfo.name,
        gender: userInfo.gender,
        birthdate: userInfo.birthdate,
        hieght: userInfo.height,
        weight: userInfo.weight,
        activityLevel: userInfo.activityLevel,
        highProteinDiet: userInfo.highProteinDiet,
      });
    };

    getUser();
  }, []);

  return (
    <main className="userInfo">
      <section className="username form-group">
        <div className="th user">
          <p>姓名</p>
        </div>
        <div className="td">
          <p>{userInfo.username}</p>
        </div>
      </section>
      <section className="gender form-group">
        <div className="th">
          <p>性別</p>
        </div>
        <div className="td">
          <p>{userInfo.gender}</p>
        </div>
      </section>
      <section className="birthdate form-group">
        <div className="th">
          <p>出生日期</p>
        </div>
        <div className="td">
          <p>{userInfo.birthdate.split("T")[0]}</p>
        </div>
      </section>
      <section className="height form-group">
        <div className="th">
          <p>身高</p>
        </div>
        <div className="td">
          <p>{userInfo.hieght}</p>
        </div>
      </section>
      <section className="weight form-group">
        <div className="th">
          <p>體重</p>
        </div>
        <div className="td">
          <p>{userInfo.weight}</p>
        </div>
      </section>
      <section className="activityLevel form-group">
        <div className="th">
          <p>運動量</p>
        </div>
        <div className="td">
          <p>{userInfo.activityLevel}</p>
        </div>
      </section>
      <section className="highProteinDiet form-group">
        <div className="th">
          <p>高蛋白飲食</p>
        </div>
        <div className="td">
          <p>{userInfo.highProteinDiet}</p>
        </div>
      </section>
    </main>
  );
};

export default UserInfoComponent;
