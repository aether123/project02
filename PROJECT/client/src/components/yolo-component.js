import React, { useState, useEffect, useRef } from "react";
import DietService from "../services/diet_service";
import TextRecordComponent from "./textRecord-component";
import "../styles/yolo.css";
function YoloComponent({ currentUser, setCurrentUser, formData, setFormData }) {
  const windowWidth = Math.floor(window.innerWidth / 2); //2; //視窗寬
  const windowHeight = Math.floor(window.innerHeight / 2); //視窗高
  const videoRef = useRef(null);
  let [mediaStream, setMediaStream] = useState(null);
  let [cameraStart, setCameraStart] = useState(false); //記錄攝像頭狀態
  let [cap, setCap] = useState(false); //紀錄影像是否被截取
  let [imgUrl, setImgUrl] = useState(""); //紀錄擷取影像資訊
  let [ocrResult, setOcrResult] = useState(false); // 紀錄影像是否已經被yolo+ocr辨識
  let [width, setWidth] = useState(windowWidth);
  let [height, setHeight] = useState(windowHeight);
  let stream;

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  useEffect(() => {
    //啟用視訊串流
    const enableVideoStream = async () => {
      try {
        if (cameraStart) {
          let video = document.querySelector(".video");
          // video.style.backgroundColor = "black";
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            width,
            height,
          });

          videoRef.current.srcObject = stream;
          //確認<img video>寬高
          const videoWidth = stream.getVideoTracks()[0].getSettings().width;
          const videoHeight = stream.getVideoTracks()[0].getSettings().height;
          const result =
            windowWidth < videoWidth
              ? (setWidth(windowWidth), setHeight(windowHeight))
              : (setWidth(videoWidth), setHeight(videoHeight));
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };
    enableVideoStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      stopStream();
    };
  }, [mediaStream, cameraStart]);

  const startCamera = () => {
    setCameraStart(true);
    setCap(false);
    setOcrResult(false);
  };
  //節取影像並顯示出來
  const captureVideo = () => {
    setCameraStart(false);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const videoWidth = videoRef.current.videoWidth; // stream 寬度
    const videoHeight = videoRef.current.videoHeight;
    const ratio = videoWidth / videoHeight; //縮放比例
    let drawWidth = width;
    let drawHeight = drawWidth / ratio; //縮放後高度
    if (drawHeight > height) {
      drawHeight = height;
      drawWidth = drawHeight * ratio;
    }

    const drawX = (width - drawWidth) / 2; //畫布起始位置
    const drawY = (height - drawHeight) / 2;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, drawX, drawY, drawWidth, drawHeight);

    const imageDataURL = canvas.toDataURL("image/jpeg");
    setImgUrl(imageDataURL);

    stopStream();
    setCap(true);
    setOcrResult(false);
  };
  //停止攝像頭
  const stopCamera = async () => {
    setCameraStart(false);
    setCap(false);
    stopStream();
    setMediaStream(null);
    setOcrResult(false);
  };

  //重啟攝像頭
  const restartVideo = () => {
    setCameraStart(true);
    setCap(false);
    setOcrResult(false);
    stopStream();
  };

  //傳送圖像給YOLO+ocr辨識
  const sendImage = async () => {
    let response = await DietService.sendNutritionImage(
      imgUrl,
      currentUser.user.id
    );
    setOcrResult(true);
    setFormData({ prodname: "", ...response.data, mealtime: "", intake: "" });
  };
  // 設定畫面狀態
  let content;
  if (cameraStart && !cap) {
    content = (
      <div className="yolo">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: width,
            height: height,
            border: "1px solid black",
            backgroundColor: "black",
          }}
          className="video"
        />
        <div className="btn">
          <button onClick={captureVideo} className="captureVideo">
            擷取照片
          </button>
          <button onClick={stopCamera} className="stopCamera">
            關閉攝像頭
          </button>
        </div>
      </div>
    );
  } else if (!cameraStart && cap) {
    content = (
      <div className="yolo">
        <img
          src={imgUrl}
          className="img"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: "1px solid black",
          }}
        />
        <div className="btn">
          <button onClick={restartVideo} className="restartCamera">
            重新擷取畫面
          </button>
          <button onClick={sendImage} className="checkImage">
            傳送圖片
          </button>
        </div>
      </div>
    );
  } else if (!cameraStart && !cap) {
    content = (
      <div className="yolo">
        <img
          className="img"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: "black",
          }}
        ></img>
        <div className="btn">
          <button onClick={startCamera} className="startCamera">
            開啟攝像頭
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      {content}
      {ocrResult && (
        <TextRecordComponent
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </>
  );
}
export default YoloComponent;
