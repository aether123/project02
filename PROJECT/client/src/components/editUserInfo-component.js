import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DietService from "../services/diet_service";
import AuthService from "../services/auth_service";
import "../styles/editUserInfo.css";
const EditUserInfoComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  //儲存使用者填寫表單的表單的資訊
  let [formData, setFormData] = useState({
    username: "",
    gender: "",
    year: "",
    month: "",
    date: "",
    height: "",
    weight: "",
    activityLevel: "",
    highProteinDiet: "",
  });
  // 紀錄錯誤訊息(表單沒填寫時送出)
  let [errorMessage, setErrorMessage] = useState({
    username: "",
    gender: "",
    birthdate: "",
    height: "",
    weight: "",
    activityLevel: "",
    highProteinDiet: "",
  });
  const handleInputChange = (e) => {
    //動態修改表單狀態
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // {...formdata,[name]:value} 前面是複製formData的值，後面是更新指定的值
  const handleUserInfo = async (e) => {
    //沒有填寫完表單會在未填寫處顯示錯誤訊息
    let valid = true;
    let newErrors = { ...errorMessage };
    const fieldsToValidate = [
      {
        field: formData.username.trim(),
        errorKey: "username",
        errorMessage: "請輸入姓名",
      },
      {
        field: formData.gender,
        errorKey: "gender",
        errorMessage: "請選擇性別",
      },
      {
        field: formData.year * formData.month * formData.date,
        errorKey: "birthdate",
        errorMessage: "請選擇完整的出生日期",
      },
      {
        field: formData.height,
        errorKey: "height",
        errorMessage: "請選擇身高",
      },
      {
        field: formData.weight,
        errorKey: "weight",
        errorMessage: "請選擇體重",
      },
      {
        field: formData.activityLevel,
        errorKey: "activityLevel",
        errorMessage: "請選擇運動量",
      },
      {
        field: formData.highProteinDiet,
        errorKey: "highProteinDiet",
        errorMessage: "請選擇高蛋白飲食",
      },
    ];

    fieldsToValidate.forEach(({ field, errorKey, errorMessage }) => {
      if (!field || field === 0) {
        newErrors[errorKey] = errorMessage;
        valid = false;
      } else {
        newErrors[errorKey] = "";
      }
    });

    setErrorMessage(newErrors);
    try {
      //確認填寫完畢，將資料儲存到資料庫
      if (valid) {
        let response = await DietService.setUserInfo(
          currentUser.user.id,
          formData.username,
          formData.gender,
          formData.year,
          formData.month,
          formData.date,
          formData.height,
          formData.weight,
          formData.activityLevel,
          formData.highProteinDiet
        );
        //重新設定localStorage的值
        localStorage.setItem("user", JSON.stringify(response.data));
        setCurrentUser(AuthService.getCurrentUser());
        navigate("/dietRecord");
      }
    } catch (e) {
      console.log(e);
    }
  };
  // 製作下拉式選單的選項
  const monthList = [];
  for (let month = 1; month <= 12; month++) {
    monthList.push(month);
  }
  const dateList = [];
  for (let date = 1; date <= 31; date++) {
    dateList.push(date);
  }
  const weightList = [];
  for (let weight = 30; weight <= 300; weight++) {
    weightList.push(weight);
  }
  const heightList = [];
  for (let height = 50; height <= 200; height++) {
    heightList.push(height);
  }

  useEffect(() => {
    //如果不是第一次登入，表單會顯示使用者資訊
    let [year, month, date] = currentUser.user.birthdate
      ? currentUser.user.birthdate.split("-")
      : ["", "", ""];
    month = month[0] == "0" ? month[1] : month;

    date =
      date.split("T")[0][0] == "0" ? date.split("T")[0][1] : date.split("T")[0];
    setFormData({
      ...formData,
      username: currentUser.user.name,
      gender: currentUser.user.gender,
      year: year,
      month: month,
      date: date,
      height: currentUser.user.height,
      weight: currentUser.user.weight,
      activityLevel: currentUser.user.activityLevel,
      highProteinDiet: currentUser.user.highProteinDiet,
    });
    //第一次填表單
    if (!currentUser.user.weight) {
      const tagList = document.querySelectorAll(".nav-link");
      tagList.forEach((tag) => {
        tag.addEventListener("click", (e) => {
          e.preventDefault();
          window.alert("請先填寫完表單");
        });
      });
    }
  }, []);
  return (
    <form className="userForm">
      <table className="user-info">
        <tbody>
          <tr>
            <th>姓名</th>
            <td>
              <input
                type="text"
                className="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              {errorMessage.username && (
                <div className="error-mesg">{errorMessage.username}</div>
              )}
            </td>
          </tr>

          <tr>
            <th>性別</th>
            <td>
              <div className="gender">
                <input
                  type="radio"
                  className="gender"
                  onChange={handleInputChange}
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  required
                />
                <label>男性</label>
                <input
                  type="radio"
                  className="gender"
                  onChange={handleInputChange}
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  required
                />
                <label>女性</label>
              </div>
              {errorMessage.gender && (
                <div className="error-mesg">{errorMessage.gender}</div>
              )}
            </td>
          </tr>

          <tr>
            <th>出生日期</th>
            <td className="birthdate">
              <div className="year">
                <input
                  type="text"
                  className="birthdate-year birthdate"
                  onChange={handleInputChange}
                  name="year"
                  value={formData.year}
                  required
                />
              </div>
              <div className="month">
                <select
                  className="birthdate-month birthdate"
                  onChange={handleInputChange}
                  name="month"
                  value={formData.month !== null ? formData.month : ""}
                  required
                >
                  <option value="">選擇月份</option>
                  {monthList.map((month) => (
                    <option key={month} value={month}>
                      {month}月
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="birthdate-date birthdate"
                  onChange={handleInputChange}
                  name="date"
                  value={formData.date !== null ? formData.date : ""}
                  required
                >
                  <option value="">選擇日期</option>
                  {dateList.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>
              {errorMessage.birthdate && (
                <div className="error-mesg">{errorMessage.birthdate}</div>
              )}
            </td>
          </tr>

          <tr>
            <th>身高</th>
            <td>
              <select
                className="height"
                onChange={handleInputChange}
                name="height"
                value={formData.height !== null ? formData.height : ""}
                required
              >
                <option value="">選擇身高</option>
                {heightList.map((height) => (
                  <option value={height} key={height}>
                    {height}公分
                  </option>
                ))}
              </select>
              {errorMessage.height && (
                <div className="error-mesg">{errorMessage.height}</div>
              )}
            </td>
          </tr>

          <tr>
            <th>體重</th>
            <td>
              <select
                className="weight"
                onChange={handleInputChange}
                name="weight"
                value={formData.weight !== null ? formData.weight : ""}
                required
              >
                <option value="">選擇體重</option>
                {weightList.map((weight) => (
                  <option value={weight} key={weight}>
                    {weight}公斤
                  </option>
                ))}
              </select>
              {errorMessage.weight && (
                <div className="error-mesg">{errorMessage.weight}</div>
              )}
            </td>
          </tr>

          <tr>
            <th>運動量</th>
            <td>
              <div className="activityLevel">
                <select
                  onChange={handleInputChange}
                  name="activityLevel"
                  value={
                    formData.activityLevel !== null
                      ? formData.activityLevel
                      : ""
                  }
                  className="activityLevel"
                  required
                >
                  <option value=""></option>
                  <option value="sedentary">不運動</option>
                  <option value="lightly_active">一周運動1-2天</option>
                  <option value="moderately_active">一周運動2-4天</option>
                  <option value="very_active">一周運動3-5天</option>
                  <option value="extra_active">
                    一周運動6天以上或者從事勞力工作或運動員
                  </option>
                </select>
              </div>
              {errorMessage.activityLevel && (
                <div className="error-mesg">{errorMessage.activityLevel}</div>
              )}
            </td>
          </tr>

          <tr>
            <th>高蛋白</th>
            <td>
              <div className="highProteinDiet">
                <input
                  type="radio"
                  className="highProteinDiet"
                  onChange={handleInputChange}
                  name="highProteinDiet"
                  value="yes"
                  checked={formData.highProteinDiet === "yes"}
                  required
                />
                <label>是</label>

                <input
                  type="radio"
                  className="highProteinDiet"
                  onChange={handleInputChange}
                  name="highProteinDiet"
                  value="no"
                  checked={formData.highProteinDiet === "no"}
                  required
                />
                <label>否</label>
              </div>
              {errorMessage.highProteinDiet && (
                <div className="error-mesg">{errorMessage.highProteinDiet}</div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <button type="button" onClick={handleUserInfo}>
        儲存
      </button>
    </form>
  );
};

export default EditUserInfoComponent;
