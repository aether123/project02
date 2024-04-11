import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DietService from "../services/diet_service";
import "../styles/textRecord.css";
const TextRecordComponent = ({
  currentUser,
  setCurrentUser,
  formData,
  setFormData,
}) => {
  let navigate = useNavigate();
  //紀錄錯誤訊息
  let [errorMessage, setErrorMessage] = useState("");
  const handleInputChange = (e) => {
    console.log(formData);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  //確認表單是否都填寫正確
  const handleRecord = async () => {
    let vaild = true;
    Object.values(formData).forEach((value) => {
      if (!value) {
        vaild = false;
      }
    });
    try {
      if (vaild) {
        const ingestIsZero = parseFloat(formData.intake) == 0 ? true : false;
        if (ingestIsZero) {
          setErrorMessage("攝取份量不能為0");
        } else {
          let response = await DietService.saveDietRecord(
            formData,
            currentUser.user.id
          );

          if (response.data == "ok") {
            navigate("/dietRecord");
          }
        }
      } else {
        setErrorMessage("請確認表單全部填寫完成");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="textRecord">
      <table>
        <tbody>
          <tr>
            <th>產品名稱</th>
            <td>
              <input
                type="text"
                className="prodname"
                name="prodname"
                value={formData.prodname}
                onChange={handleInputChange}
                required
              />
            </td>
          </tr>
          <tr>
            <th>每一份量</th>
            <td>
              <input
                type="text"
                className="g_ml_num"
                name="g_ml_num"
                value={formData.g_ml_num}
                onChange={handleInputChange}
                required
              />
              &nbsp; g/ml
            </td>
          </tr>
          <tr>
            <th>本包裝含</th>
            <td>
              <input
                type="text"
                className="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                required
              />
              &nbsp; 份
            </td>
          </tr>
          <tr>
            <th>熱量</th>
            <td>
              <input
                type="text"
                className="heat"
                name="heat"
                value={formData.heat}
                onChange={handleInputChange}
                required
              />
              &nbsp; kcal
            </td>
          </tr>
          <tr>
            <th>蛋白質</th>
            <td>
              <input
                type="text"
                className="protein"
                name="protein"
                value={formData.protein}
                onChange={handleInputChange}
                required
              />
              &nbsp; g
            </td>
          </tr>
          <tr>
            <th>脂肪</th>
            <td>
              <input
                type="text"
                className="totalfat"
                name="totalfat"
                value={formData.totalfat}
                onChange={handleInputChange}
                required
              />
              &nbsp; g
            </td>
          </tr>
          <tr>
            <th>飽和脂肪</th>
            <td>
              <input
                type="text"
                className="satfat"
                name="satfat"
                value={formData.satfat}
                onChange={handleInputChange}
                required
              />
              &nbsp; g
            </td>
          </tr>
          <tr>
            <th>反式脂肪</th>
            <td>
              <input
                type="text"
                className="transfat"
                name="transfat"
                value={formData.transfat}
                onChange={handleInputChange}
                required
              />
              &nbsp; g
            </td>
          </tr>
          <tr>
            <th>碳水化合物</th>
            <td>
              <input
                type="text"
                className="carbohydrate"
                name="carbohydrate"
                value={formData.carbohydrate}
                onChange={handleInputChange}
                required
              />
              &nbsp; g
            </td>
          </tr>
          <tr>
            <th>糖</th>
            <td>
              <input
                type="text"
                className="sugar"
                name="sugar"
                value={formData.sugar}
                onChange={handleInputChange}
                required
              />
              &nbsp; g
            </td>
          </tr>
          <tr>
            <th>鈉</th>
            <td>
              <input
                type="text"
                className="sodium"
                name="sodium"
                value={formData.sodium}
                onChange={handleInputChange}
                required
              />
              &nbsp; mg
            </td>
          </tr>
          <tr>
            <th>攝取份量</th>
            <td>
              <input
                type="text"
                className="intake"
                name="intake"
                value={formData.intake}
                onChange={handleInputChange}
                required
              />
              &nbsp; 份
            </td>
          </tr>
          <tr>
            <th>用餐時間</th>
            <td>
              <input
                type="radio"
                className="mealtime"
                name="mealtime"
                value="早餐"
                onChange={handleInputChange}
                required
              />
              <label>早餐</label>
              <input
                type="radio"
                className="mealtime"
                name="mealtime"
                value="中餐"
                onChange={handleInputChange}
                required
              />
              <label>中餐</label>
              <input
                type="radio"
                className="mealtime"
                name="mealtime"
                value="晚餐"
                onChange={handleInputChange}
                required
              />
              <label>晚餐</label>
            </td>
          </tr>
        </tbody>
      </table>
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      <button onClick={handleRecord}>紀錄</button>
    </div>
  );
};

export default TextRecordComponent;
