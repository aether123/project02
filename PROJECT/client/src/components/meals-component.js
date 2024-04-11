import React, { useState, useEffect } from "react";
import DietService from "../services/diet_service";
import AuthService from "../services/auth_service";
const MealsComponent = ({ currentUser, setCurrentUser, date }) => {
  let [breakfast, setBreakfast] = useState([]); //早餐飲食紀錄
  let [lunch, setLunch] = useState([]); //中餐飲食紀錄
  let [dinner, setDinner] = useState([]); //晚餐飲食紀錄
  useEffect(() => {
    const fetchData = async () => {
      //更改時間時要清空紀錄
      setBreakfast([]);
      setLunch([]);
      setDinner([]);
      //轉換時間格式
      let matches = date.match(/(\d{4}) 年 (\d{1,2}) 月 (\d{1,2}) 日/);
      let newDate = new Date(matches[1], matches[2] - 1, matches[3]);
      let formatter = new Intl.DateTimeFormat("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formatDate = formatter.format(newDate);

      try {
        //判斷透過哪種方式登入
        let checkGoogleLogin = await AuthService.CheckGoogleLogin();
        const userInfo = checkGoogleLogin.data.user;
        let response;
        if (userInfo) {
          response = await DietService.getDietRecord(userInfo.id, formatDate);
        } else {
          response = await DietService.getDietRecord(
            currentUser.user.id,
            formatDate
          );
        }

        let meals = response.data;
        //將資料庫抓取到的飲食紀錄分類
        if (meals) {
          meals.forEach((meal) => {
            if (meal.time == "早餐") {
              setBreakfast((prevBreakfast) => [...prevBreakfast, meal]);
            }
            if (meal.time == "中餐") {
              setLunch((prevLunch) => [...prevLunch, meal]);
            }
            if (meal.time == "晚餐") {
              setDinner((prevDinner) => [...prevDinner, meal]);
            }
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [date]);

  function mealsInfo(mealTime) {
    return mealTime.map((meal, index) => (
      <div key={index} className="meal breakfast">
        <p>
          名稱：{meal.prodname}&emsp;攝取份量:{meal.intake}
        </p>
        <p>
          熱量：{meal.heat}&emsp;蛋白質:{meal.protein}{" "}
        </p>
        <p>
          脂肪：{meal.totalfat}&emsp;碳水化合物:{meal.carbohydrate}
        </p>
      </div>
    ));
  }

  return (
    <section className="meals">
      <h2>今日飲食</h2>

      {breakfast.length > 0 && (
        <>
          <h3>早餐</h3>
          {mealsInfo(breakfast)}
        </>
      )}

      {lunch.length > 0 && (
        <>
          <h3>午餐</h3>
          {mealsInfo(lunch)}
        </>
      )}

      {dinner.length > 0 && (
        <>
          <h3>晚餐</h3>
          {mealsInfo(dinner)}
        </>
      )}
      {dinner.length == 0 && lunch.length == 0 && breakfast.length == 0 && (
        <div>
          <p>無飲食紀錄</p>
        </div>
      )}
    </section>
  );
};

export default MealsComponent;
