import React, { useEffect, useState } from "react";
import "./GarbageCollector.css"; // Import CSS for styling
import BarSide from "../../components/SideBarNavi/BarSide.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper";

const ImageSharingApp = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Fetch approved complaints
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get-complaints-approved`);
        if (response.data.checking) {
          setComplaints(response.data.complaints);
        } else {
          console.error("Error fetching complaints:", response.data.msg);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="body-content grid grid-rows-[1fr_auto] gap-4 min-h-[100dvh]">
      <div className="main-content">
        <aside>
          <BarSide activePage="tempIDDetails" />
        </aside>
        <main className="content" style={{ padding: 0 }}>

          {/* Header */}
          <div className="header">
            <h1>Approved Complaints</h1>
            <div className="header-icons">
              <span>🔍</span>
              <span>⋯</span>
            </div>
          </div>

          {/* Content */}
          <div className="complaints-grid">
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <div key={complaint._id} className="card">
                  <div className="card-image">
                    <img
                      src={complaint.photo || "/default-image.jpg"}
                      alt="Complaint"
                      className="image-icon"
                    />
                    <div className="card-menu">⋯</div>
                  </div>
                  <div className="card-info">
                    <div className="card-text">
                      <div className="card-title">{complaint.location}</div>
                      <div className="card-description">{complaint.description}</div>
                      <div className="status">✅ {complaint.status }</div>
                    </div>
                    <div className="arrow">→</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No approved complaints found.</p>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="bottom-nav">
            <div className="nav-item">🏠</div>
            <div className="nav-item">🔍</div>
            <div className="nav-item">👤</div>
          </div>

          {/* Home Indicator */}
          <div className="home-indicator"></div>
        </main>
      </div>
      <div className="footer-style">
        <Footer style={{ position: "fixed", bottom: 0, width: "100%" }} />
      </div>
    </div>
  );
};

export default ImageSharingApp;
