import React from "react";
import "./Dashboard.css";
import BarSide from "../../components/SideBarNavi/BarSide.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import ComplaintsTable from "./ComplaintsTable.jsx";


const Leaderboard = () => {

  return (
    <div className="body-content grid grid-rows-[1fr_auto] gap-4 min-h-[100dvh]">
      <div className="main-content">
        <aside>
          <BarSide activePage="userDashboard" />
        </aside>
        <main className="content py-6 px-px">
          <div className="container">
            <header>
              <div className="logo">EcoCollect</div>
              <h1 style={{margin: 0}}>Indian States Waste Collection Dashboard</h1>
              <p className="subtitle">
                Tracking waste collection efforts across India.
              </p>
            </header>

              <ComplaintsTable />
          </div>
        </main>
      </div>
      <div className="footer-style">
        <Footer style={{ position: "fixed", bottom: 0, width: "100%" }} />
      </div>
    </div>
  );
};

export default Leaderboard;
