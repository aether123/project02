import React, { useState, useEffect } from "react";
import AuthService from "../services/auth_service";
import DietService from "../services/diet_service";
import MealsComponent from "./meals-component";
import "../styles/dietRecord.css";
import "../styles/meals.css";
const DietRecordComponent = ({ currentUser, setCurrentUser }) => {
  let [username, setUsername] = useState(""); //記錄使用者姓名
  let [date, setDate] = useState(DietService.showTime()); //紀錄日期
  let [strokeDashoffset, setStrokeDashoffset] = useState("0");
  let [nutritionData, setNutritionData] = useState({
    heatTarget: "",
    heatRemain: "",
    heatIngest: "",
    proteinRemain: "",
    totalfatRemain: "",
    carbohydrateRemain: "",
    proteinTarget: "",
    totalfatTarget: "",
    carbohydrateTarget: "",
  }); //紀錄簡易版營養攝取量
  let r = 120;
  let circle = document.querySelector(".circle");

  const totalfatPercentage =
    (1 - nutritionData.totalfatRemain / nutritionData.totalfatTarget) * 100;
  const proteinPercentage =
    (1 - nutritionData.proteinRemain / nutritionData.proteinTarget) * 100;
  const carbohydratePercentage =
    (1 - nutritionData.proteinRemain / nutritionData.proteinTarget) * 100;
  const totalfatIsPositive = nutritionData.totalfatRemain > 0 ? true : false;
  const proteinIsPositive = nutritionData.proteinRemain > 0 ? true : false;
  const carbohydrateIsPositive =
    nutritionData.carbohydrateRemain > 0 ? true : false;
  const heatIsPositive = nutritionData.heatRemain > 0 ? true : false;
  //初始化頁面
  useEffect(() => {
    const initInfo = async () => {
      let intake = {};
      try {
        let response = await AuthService.CheckGoogleLogin(); // 確認是否透過Google auth 登入
        const googleUserInfo = response.data.user;
        if (googleUserInfo) {
          //將資訊存到localstorage
          localStorage.setItem("user", JSON.stringify(response.data));
          setCurrentUser(AuthService.getCurrentUser());
          setUsername(response.data.user.name);
          //判斷是否是第一次登入，第一次登入導向編輯使用者資訊
          if (!googleUserInfo.height) {
            window.location.href = "/editUserInfo";
          } else {
            //抓取簡易營養量攝取的值
            intake = await DietService.getSimpleNutritionIntake(
              response.data.user.id
            );
          }
        } else {
          //localhost 登入
          setUsername(currentUser.user.name);
          if (!currentUser.user.height) {
            //判斷是否是第一次登入，第一次登入導向編輯使用者資訊
            window.location.href = "/editUserInfo";
          } else {
            //抓取簡易營養量攝取的值
            intake = await DietService.getSimpleNutritionIntake(
              currentUser.user.id
            );
          }
        }

        setNutritionData({ ...intake.data });

        setStrokeDashoffset(
          2 * Math.PI * r * (intake.data.heatRemain / intake.data.heatTarget)
        );
      } catch (e) {
        console.log(e);
      }
    };

    initInfo();
  }, []);

  const editUserInfo = () => {
    window.location.href = "/editUserInfo";
  };

  const textRecord = () => {
    window.location.href = "/textRecord";
  };
  const yoloRecord = () => {
    window.location.href = "/yolo";
  };
  const barcodeRecord = () => {
    window.location.href = "/barcode";
  };

  function progressBar(isPositive, percentage) {
    percentage = isPositive ? percentage : 100;
    return (
      <div className="progress">
        <div
          className={`progress-bar progress-bar-striped bg-${
            isPositive ? "success" : "danger"
          } progress-bar-animated`}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>
    );
  }

  function nutritonRemain(remainValue, isPositive) {
    if (isPositive) {
      return (
        <p className="remain-value positive-number">可攝取{remainValue}</p>
      );
    } else
      return (
        <p className="remain-value negative-number">
          過量{Math.abs(remainValue)}
        </p>
      );
  }

  return (
    <div className="dietRecord">
      <header>
        <div className="username">{username}的飲食紀錄</div>
        <div className="showTime">{date}</div>
      </header>
      <main>
        <section className="btn btn-group">
          <button className="text" onClick={textRecord}>
            文字輸入
          </button>
          <button className="barcode" onClick={barcodeRecord}>
            條碼掃描
          </button>
          <button className="form" onClick={yoloRecord}>
            營養標籤辨識
          </button>
          <button className="user" onClick={editUserInfo}>
            修改個人資訊
          </button>
        </section>
        <section className="nutrition-heat">
          <section className="target-heat heat">
            <img src="https://i.imgur.com/xAILLsJ.png" alt="目標值圖示" />
            <h5>目標值</h5>
            <p className="target-diet-value">
              {nutritionData.heatTarget}&nbsp;kcal
            </p>
          </section>
          <section className="remain-heat heat">
            <div className="circleBox">
              <svg
                id="svg"
                width="300"
                height="300"
                viewBox="0 0 300 300"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  id="circle"
                  className="circle"
                  r={r}
                  cx="150"
                  cy="150"
                  fill="transparent"
                  strokeDasharray={2 * r * Math.PI}
                  strokeDashoffset="0"
                  stroke={strokeDashoffset < 0 ? "red" : "#666"}
                />
                <circle
                  id="bar"
                  className="bar"
                  r={r}
                  cx="150"
                  cy="150"
                  fill="transparent"
                  strokeDasharray={2 * r * Math.PI} //
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90, 150, 150)"
                />
                <text
                  x="150"
                  y="144"
                  fill="rgb(166, 26, 26)"
                  fontWeight="blod"
                  fontSize="1.5rem"
                  textAnchor="middle"
                  style={heatIsPositive ? {} : { fontWeight: "bold" }}
                >
                  {heatIsPositive ? "可攝取" : "過量"}
                </text>
                <text
                  x="150"
                  y="184"
                  fill="black"
                  style={heatIsPositive ? {} : { fontWeight: "bold" }}
                >
                  {heatIsPositive
                    ? nutritionData.heatRemain
                    : Math.abs(nutritionData.heatRemain)}
                  &nbsp;kcal
                </text>
              </svg>
            </div>
          </section>
          <section className="ingest-heat heat">
            <img src="https://i.imgur.com/VpkYCRq.png" alt="已攝取圖示" />
            <h5>已攝取</h5>
            <p className="ingest-diet-value">
              {nutritionData.heatIngest}&nbsp;kcal
            </p>
          </section>
        </section>
        <section className="nutrition-intake">
          <section className="protein-diet nutrition-remain">
            <h5>蛋白質</h5>
            {nutritonRemain(nutritionData.proteinRemain, proteinIsPositive)}
            {progressBar(proteinIsPositive, proteinPercentage)}
          </section>
          <section className="totalFat-diet nutrition-remain">
            <h5>脂肪</h5>
            {nutritonRemain(nutritionData.totalfatRemain, totalfatIsPositive)}
            {progressBar(totalfatIsPositive, totalfatPercentage)}
          </section>
          <section className="carbohydrate-diet nutrition-remain">
            <h5>碳水化合物</h5>
            {nutritonRemain(
              nutritionData.carbohydrateRemain,
              carbohydrateIsPositive
            )}
            {progressBar(carbohydrateIsPositive, carbohydratePercentage)}
          </section>
        </section>
      </main>

      <MealsComponent
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        date={date}
      />
    </div>
  );
};

export default DietRecordComponent;
