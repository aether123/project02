import axios from "axios";
const API_URL = "http://localhost:8080/diet";

class DietService {
  constructor() {
    this.weekList = [];
  }

  //顯示時間 時間輸入 "" 或 xxxx/xx/xx
  showTime(date = "") {
    let newDate;
    let year, month, day, dayOfWeek;
    let dayList = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    if (!date) {
      newDate = new Date();
      year = newDate.getFullYear(); //獲取年分
      month = newDate.getMonth() + 1; //獲取月份，月份0開始所以加一
      day = newDate.getDate(); //獲取日期
    } else {
      [year, month, day] = date.split("/").map(Number); //xxxx/xx/xx 拆分成年日月
      newDate = new Date(year, month - 1, day);
    }
    dayOfWeek = dayList[newDate.getDay()];
    return (
      year + " 年" + " " + month + " 月" + " " + day + " 日" + " " + dayOfWeek
    );
  }

  //將選擇麼時間顯示出來
  setDate(date) {
    //將日曆選擇器選擇日期轉成 xxxx/xx/xx
    let formatter = new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    date = formatter.format(date);
    //日曆選擇需要轉換不同週數
    this.getDayOfWeek(new Date(date));
    //改顯示擇時間
    return this.showTime(date);
  }

  //獲取一周日期
  getDayOfWeek(date) {
    let today = date.getDay(); //獲取當前日期
    today = today === 0 ? 6 : --today; //0->1 ...7->6
    let monday = new Date(date); //先設定monday之後轉時間搓用(setDate)
    //星期一的日期 ,date.getDate()當前日期-date.Day()星期幾
    monday.setDate(date.getDate() - today);
    this.weekList = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date(monday); //設定date之後轉時間搓用(setDate)
      date.setDate(monday.getDate() + i);
      let formatter = new Intl.DateTimeFormat("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      date = formatter.format(date); //轉 xxx/xx/xx
      this.weekList.push(date);
    }

    return this.weekList;
  }

  // 取得星期幾
  getDay(date = "") {
    // 預設是今天日期 new Date() 另一個是日曆選擇的日期new Date(date)
    const newDate = date ? new Date(date) : new Date();
    let day = newDate.getDay();
    return day === 0 ? 6 : day - 1;
  }

  //將使用者資訊存到資料庫
  setUserInfo(
    id,
    name,
    gender,
    year,
    month,
    date,
    height,
    weight,
    activityLevel,
    highProteinDiet
  ) {
    month = month < 10 ? `0${month}` : month;
    date = date < 10 ? `0${date}` : date;
    const birthdate = year + "-" + month + "-" + date;

    return axios.put(API_URL + `/userInfo/${id}`, {
      name,
      gender,
      birthdate,
      height,
      weight,
      activityLevel,
      highProteinDiet,
    });
  }
  //紀錄飲食紀錄
  saveDietRecord(formData, id) {
    return axios.post(API_URL + `/dietReocrd/${id}`, { formData });
  }

  //獲取簡單版的營養攝取
  getSimpleNutritionIntake(id) {
    return axios.get(API_URL + `/simpleNutrition/${id}`);
  }

  //獲取的飲食紀錄
  getDietRecord(id, date) {
    return axios.get(API_URL + "/dietReocrd", { params: { id, date } });
  }
  //獲取營養攝取量
  getNutritionInfo(id, date) {
    return axios.get(API_URL + "/nutritionINtake", { params: { id, date } });
  }

  //獲取使用者營養目攝取標值
  getNutritionTarget(id) {
    return axios.get(API_URL + `/nutritionTarget/${id}`);
  }

  //獲取產品之訊
  getProductInfo(barcode) {
    return axios.get(API_URL + `/productInfo/${barcode}`);
  }
  //將營養表的圖片傳給yolo+ocr辨識
  sendNutritionImage(image, id) {
    const formData = new FormData(); //取得的值是base64 將該值變成表單傳送
    formData.append("file", image);
    formData.append("id", id);
    return axios.post("http://localhost:5000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new DietService();
