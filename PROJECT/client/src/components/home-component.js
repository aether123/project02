import React from "react";
import "../styles/style.css";
const HomeComponent = ({ currentUser, setCurrentUser }) => {
  return (
    <main className="homepage">
      <section className="userInfo">
        <div className="mypicture">
          <img src="/picture/mypicture.png" alt="個人照片" />
        </div>
        <div className="name">
          <h1>康宗良</h1>
        </div>
        <div className="info">
          <ul>
            <li>
              <img src="/picture/person-solid.svg" alt="person" />
              <p>男</p>
            </li>
            <li>
              <img src="/picture/cake-candles-solid.svg" alt="birth" />
              <p>1994-03-15</p>
            </li>
            <li>
              <img src="/picture/mobile-screen-button-solid.svg" alt="phone" />
              <p>0930072578</p>
            </li>
            <li>
              <img src="/picture/envelope-regular.svg" alt="mail" />
              <p>jefflllk19940315@gmail.com</p>
            </li>
          </ul>
        </div>
      </section>
      <section className="resume">
        <h2>簡歷</h2>
        <hr />
        <p>我是康宗良</p>
        <p>喜歡挑戰新事物，認真負責，想盡辦法完成任務。</p>
        <p>
          對於不了解的事物會主動學習，閒暇之餘會在網路上學習IT與軟體相關技術。
        </p>
        <p>大學畢業後，我從事創客教育，涉足了許多微控制器和相關硬體技術。</p>
        <p>
          教導學生如何通過編寫程式來控制微控制器，從而打造他們自己的機器人。
        </p>
        <p>舉辦了許多與創客教育相關的教師研習。</p>
        <p>後期主要教學AIOT物聯網相關課程。</p>
      </section>
      <section className="work">
        <h2>工作經驗</h2>
        <hr />
        <p>騏驥坊股份有限公司教學部組長</p>
        <ol>
          <li>桃園城市城市培力計畫講師</li>
          <li>教師赴公民營-ESP32物聯網與居家控制講師</li>
          <li>新北市百場創課教師研習-智慧居家講師</li>
          <li>健行科大-邏輯思考設計講師</li>
          <li>台北復興實驗高中-中學部steam課程與AI課程講師</li>
          <li>桃園新興國中機器人社團課老師</li>
          <li>TIRT科技寶比賽講師</li>
          <li>桃園北科附工模具科創客工坊Arduino創意智慧控制外聘講師</li>
          <li>嘉義民族國小-飛行特色課程講師</li>
          <li>騏驥坊創客教育課程研發</li>
        </ol>
      </section>
      <section className="skill">
        <h2>專業技能</h2>
        <hr />
        <ol>
          <li>JavaScript, Web Development</li>
          <li>Python</li>
          <li>SQL</li>
          <li>Deep Learning</li>
          <li>Machine Learning</li>
          <li>容器化技術暨微服務架構</li>
        </ol>
      </section>
      <section className="edu">
        <h2>學歷</h2>
        <hr />
        <h3>國立中興大學</h3>
        <h4>電機工程學系 學士</h4>
      </section>
    </main>
  );
};

export default HomeComponent;
