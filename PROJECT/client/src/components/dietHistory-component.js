import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MealsComponent from "./meals-component";
import DietService from "../services/diet_service";
import "../styles/meals.css";
import "../styles/dietHistory.css";
const DietHistoryComponent = ({ currentUser, setCurrentUser }) => {
  let [username, setUsername] = useState("");
  let [date, setDate] = useState(DietService.showTime()); //顯示時間
  const days = ["一", "二", "三", "四", "五", "六", "日"];
  let [dayOfWeek, setDayOfWeek] = useState(
    DietService.getDayOfWeek(new Date())
  ); //記錄一周日期
  let [activeDay, setActiveDay] = useState(DietService.getDay()); //判斷是星期幾
  let [startDate, setStartDate] = useState(new Date()); //紀錄日歷日期
  let [nutrition, setNutrition] = useState({
    熱量: "",
    蛋白質: "",
    脂肪: "",
    碳水化合物: "",
    糖: "",
    鈉: "",
  }); //紀錄營養攝取量

  let [nutritionTarget, setNutritionTarget] = useState({}); //紀錄營養目標值
  //克制input圖形
  const CustomDatePickerIcon = React.forwardRef((props, ref) => {
    return (
      <button ref={ref} onClick={props.onClick}>
        <img src="icons8-calendar-48.png" alt="DatePicker Icon" />
      </button>
    );
  });
  //日歷選擇器或一周選擇更改日期時改變顯示時間與day的style
  function changeDay(day) {
    setActiveDay(day);
    setDate(DietService.showTime(dayOfWeek[day]));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await DietService.getNutritionTarget(
          currentUser.user.id
        );

        setNutritionTarget({ ...response.data });
      } catch (e) {
        console.log(e);
      }
    };
    setUsername(currentUser.user.name);
    fetchData();
  }, []);
  //日曆選擇器選擇日期時改變顯示日期
  useEffect(() => {
    let newDate = DietService.setDate(startDate);
    setDate(newDate);
  }, [startDate]);

  //抓取營養攝取量
  useEffect(() => {
    const fetchData = async () => {
      //將日期轉換成mysql可以辨識的樣式並轉成台灣時區
      let matches = date.match(/(\d{4}) 年 (\d{1,2}) 月 (\d{1,2}) 日/);
      let newDate = new Date(matches[1], matches[2] - 1, matches[3]);
      let formatter = new Intl.DateTimeFormat("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formatDate = formatter.format(newDate);
      try {
        let response = await DietService.getNutritionInfo(
          currentUser.user.id,
          formatDate
        );
        let nutritions = response.data[0];

        if (nutritions) {
          setNutrition({ ...nutritions });
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [date]);

  return (
    <div className="dietHistory">
      <header>
        <div className="username">{username}的飲食紀錄</div>
        <div className="showTime">
          <p>{date}</p>
        </div>
        <DatePicker
          customInput={<CustomDatePickerIcon />}
          onChange={(date) => {
            setStartDate(date);
            const week = DietService.getDayOfWeek(date);
            const day = DietService.getDay(date);
            setActiveDay(day);
            setDayOfWeek(week);
          }}
        />
      </header>
      <main>
        <section className="dayOfWeek">
          <ul>
            {days.map((day, index) => (
              <div>
                <li key={`${day}-${index}`}>
                  <a
                    href="#"
                    className="day"
                    onClick={() => {
                      changeDay(index);
                    }}
                    style={
                      activeDay == index
                        ? {
                            backgroundColor: "blue",
                            color: "white",
                            borderRadius: "50%",
                          }
                        : {}
                    }
                  >
                    {day}
                  </a>
                </li>
              </div>
            ))}
          </ul>
        </section>
        <section className="nutritionIntake">
          <div className="unit">
            <p>累計/目標單位</p>
          </div>
          {Object.keys(nutrition).map((key) => (
            <div className="info-bar" key={key}>
              <div className="nutritionInfo">
                <p className="nutrition">{key}</p>
                <p className="unit">
                  {Math.ceil(nutrition[key])}/{nutritionTarget[key]}
                  {key === "熱量" && <span>&nbsp;(卡)</span>}
                  {key === "鈉" && <span>&nbsp;(mg)</span>}
                  {key && key != "鈉" && key != "熱量" && (
                    <span>&nbsp;(g)</span>
                  )}
                </p>
              </div>
              <div className="bar">
                <progress
                  value={nutrition[key]}
                  max={nutritionTarget[key]}
                  style={
                    nutrition[key] >= nutritionTarget[key]
                      ? { accentColor: "red" }
                      : { accentColor: "green" }
                  }
                ></progress>
              </div>
            </div>
          ))}
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

export default DietHistoryComponent;
