import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import DietService from "../services/diet_service";
import TextRecordComponent from "./textRecord-component";

const BarcodeComponent = ({
  currentUser,
  setCurrentUser,
  formData,
  setFormData,
}) => {
  let [scanResult, setScanResult] = useState(""); //紀錄qrcode 結果
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 600,
        height: 200,
      },
      fps: 10,
      // disableFlip: false,
    });

    scanner.render(success);
    async function success(result) {
      scanner.clear();
      setScanResult(result);
      //資料庫尋找是否有此barcode
      let response = await DietService.getProductInfo(result);
      //沒有轉換網址
      if (response.data.length == 0) {
        navigate("/yolo");
      }

      setFormData({ ...response.data[0], mealtime: "" });
    }
  }, []);

  return (
    <>
      <div className="barcode">
        {scanResult ? (
          <div>
            Sucess:<p>{scanResult}</p>
          </div>
        ) : (
          <div id="reader"></div>
        )}
        <div id="reader"></div>
      </div>
      {scanResult && (
        <TextRecordComponent
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </>
  );
};

export default BarcodeComponent;
