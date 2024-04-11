import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginComponent from "./components/login-component";
import RegisterComponent from "./components/register-component";
import DietRecordComponent from "./components/dietRecord-component";
import DietHistoryComponent from "./components/dietHistory-component";
import HomeComponent from "./components/home-component";
import UserInfoComponent from "./components/userInfo-component";
import AuthService from "./services/auth_service";
import EditUserInfo from "./components/editUserInfo-component";
import TextRecordComponent from "./components/textRecord-component";
import BarcodeComponent from "./components/barcode-component";
import YoloComponent from "./components/yolo-component";

//npm install react-router-dom
function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  let [formData, setFormData] = useState({
    prodname: "",
    g_ml_num: "",
    unit: "",
    heat: "",
    protein: "",
    totalfat: "",
    satfat: "",
    transfat: "",
    carbohydrate: "",
    sugar: "",
    sodium: "",
    mealtime: "",
    intake: "",
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route
            index
            element={
              <HomeComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route path="registor" element={<RegisterComponent />} />
          <Route
            path="login"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="dietRecord"
            element={
              <DietRecordComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="dietHistory"
            element={
              <DietHistoryComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="userInfo"
            element={
              <UserInfoComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />

          <Route
            path="editUserInfo"
            element={
              <EditUserInfo
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="textRecord"
            element={
              <TextRecordComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                formData={formData}
                setFormData={setFormData}
              />
            }
          />
          <Route
            path="barcode"
            element={
              <BarcodeComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                formData={formData}
                setFormData={setFormData}
              />
            }
          />
          <Route
            path="yolo"
            element={
              <YoloComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                formData={formData}
                setFormData={setFormData}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
