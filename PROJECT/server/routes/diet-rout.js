const router = require("express").Router();
const { query } = require("express");
const User = require("../models/user-model");
const Nutrition = require("../modules/Nutrition");
//儲存使用者資訊
router.put("/userInfo/:id", async (req, res) => {
  const { ...userdata } = req.body;
  const { id } = req.params;
  try {
    const updateUser = await User.promise().query(
      "UPDATE user SET  name=?, gender = ?, birthdate = ?, height = ?, weight = ?,activityLevel = ?, highProteinDiet = ? WHERE id = ?;",
      [...Object.values(userdata), id]
    );
    let [foundUser, field] = await User.promise().query(
      "SELECT * FROM user WHERE id = ?",
      [id]
    );

    return res.send({ message: "修改成功", user: foundUser[0] });
  } catch (e) {
    return res.status(e).send("使用者資訊儲存失敗");
  }
});
//儲存飲食紀錄
router.post("/dietReocrd/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { formData } = req.body;
    let values = Object.values(formData);
    intake = parseFloat(formData.intake);
    if (intake !== 1) {
      values = values.map((value, index) =>
        index >= 3 && index <= 10 ? value * intake : value
      );
    }

    let [inserteDiet, insertFields] = await User.promise().query(
      "INSERT INTO dietrecord ( userID ,prodname ,g_ml_num ,unit ,heat ,protein ,totalfat ,satfat ,transfat,carbohydrate ,sugar ,sodium ,time,intake) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [id, ...values]
    );

    return res.send("ok");
  } catch (e) {
    return res.status(500).send("資料儲存失敗");
  }
});

// 查詢簡易版飲食狀態(dietRecord用)
router.get("/simpleNutrition/:id", async (req, res) => {
  let { id } = req.params;
  try {
    //找使用者體態資料
    let [foundUser, field] = await User.promise().query(
      "select height,weight,TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) as age,gender ,activityLevel,highProteinDiet from user where id=?",
      [id]
    );
    let [height, weight, age, gender, activity_level, workout] = [
      ...Object.values(foundUser[0]),
    ];
    //計算目標值
    result = Nutrition.nutritionTarget(
      height,
      weight,
      age,
      gender,
      activity_level,
      workout
    );
    // 攝取量
    let [ingestNutrition, ingestfield] = await User.promise().query(
      "select sum(heat) ,sum(protein),sum(totalfat),sum(carbohydrate) from dietrecord where userID=? and date=CURDATE() GROUP BY date",
      [id]
    );

    let [heatIngest, proteinIngest, totalfatIngest, carbohydrateIngest] =
      ingestNutrition.length > 0
        ? Object.values(ingestNutrition[0])
        : [0, 0, 0, 0];
    //算出剩餘量
    let [heatTarget, proteinTarget, totalfatTarget, carbohydrateTarget] = [
      ...Object.values(result),
    ];

    heatIngest = Math.floor(heatIngest);
    heatRemain = heatTarget - heatIngest;
    proteinRemain = proteinTarget - Math.floor(proteinIngest);
    totalfatRemain = totalfatTarget - Math.floor(totalfatIngest);
    carbohydrateRemain = carbohydrateTarget - Math.floor(carbohydrateIngest);
    return res.send({
      heatTarget,
      heatRemain,
      heatIngest,
      proteinRemain,
      totalfatRemain,
      carbohydrateRemain,
      proteinTarget,
      totalfatTarget,
      carbohydrateTarget,
    });
  } catch (e) {
    return res.status(400).send("資料有問題");
  }
});

//獲取飲食紀錄
router.get("/dietReocrd", async (req, res) => {
  let { id, date } = req.query;

  try {
    let [dietRecord, field] = await User.promise().query(
      "select prodname,intake,heat,protein,totalfat,carbohydrate,time from dietrecord where date=? AND userId=?",
      [date, id]
    );

    return res.send(dietRecord);
  } catch (e) {
    return res.status(400).send("資料尋找失敗");
  }
});

// 獲取飲食攝取總量
router.get("/nutritionINtake", async (req, res) => {
  let { id, date } = req.query;

  try {
    let [dietRecord, field] = await User.promise().query(
      "select IFNULL(sum(heat), 0) as 熱量, IFNULL(sum(protein), 0) as 蛋白質, IFNULL(sum(totalfat), 0) as 脂肪, IFNULL(sum(carbohydrate), 0) as 碳水化合物, IFNULL(sum(sugar), 0) as 糖, IFNULL(sum(sodium), 0) as 鈉 from dietrecord where date=? AND userId=? GROUP BY date",
      [date, id]
    );

    if (dietRecord.length == 0) {
      dietRecord = [
        {
          熱量: "0",
          蛋白質: "0",
          脂肪: "0",
          碳水化合物: "0",
          糖: "0",
          鈉: "0",
        },
      ];
    }

    return res.send(dietRecord);
  } catch (e) {
    return res.status(400).send("資料尋找失敗");
  }
});

//獲取飲食攝取目標
router.get("/nutritionTarget/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let [foundUser, field] = await User.promise().query(
      "select height,weight,TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) as age,gender ,activityLevel,highProteinDiet from user where id=?",
      [id]
    );
    let [height, weight, age, gender, activity_level, workout] = [
      ...Object.values(foundUser[0]),
    ];

    //計算目標值
    result = Nutrition.nutritionTarget(
      height,
      weight,
      age,
      gender,
      activity_level,
      workout
    );

    let otherResult = {};
    otherResult["糖"] = gender == "female" ? 25.0 : 36.0;
    otherResult["鈉"] = 2000.0;
    result = { ...result, ...otherResult };

    return res.send(result);
  } catch (e) {
    return res.status(400).send("資料抓取失敗");
  }
});

//查詢商品名稱
router.post("/productInfo", async (req, res) => {
  let { barcode } = req.params;

  try {
    let [foundProduct, field] = await User.promise().query(
      "select prodname,g_ml_num,unit,heat,protein,totalfat,satfat,transfat,carbohydrate,sugar,sodium from products WHERE BARCODE=? ",
      [barcode]
    );
    res.send(foundProduct);
  } catch (e) {
    return res.status(400).send("系統發生錯誤");
  }
});

module.exports = router;
