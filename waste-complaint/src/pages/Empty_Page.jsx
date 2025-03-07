import React from 'react'
import BarSide from "../components/SideBarNavi/BarSide.jsx";
import Footer from "../components/Footer/Footer.jsx";

function Empty_Page() {
  return (
    <div className="body-content grid grid-rows-[1fr_auto] gap-4 min-h-[100dvh]">
      <div className="main-content">
        <aside>
          <BarSide activePage="tempIDDetails" />
        </aside>
        <main className="content py-6 px-px">
          {/* 
          
                Start Designing / Code here 
                
          */}
        </main>
      </div>
      <div className="footer-style">
        <Footer style={{ position: "fixed", bottom: 0, width: "100%" }} />
      </div>
    </div>
  );
}

export default Empty_Page