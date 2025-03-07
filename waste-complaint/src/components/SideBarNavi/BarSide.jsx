  import React, { useState, useEffect, useRef } from "react";
  import { FaPersonMilitaryPointing } from "react-icons/fa6";
  import {
    MdOutlineDashboard,
    MdHome,
    MdCreate,
    MdPostAdd,
    MdContactPage,
    MdOutlineFormatListBulleted,
    MdMenu,
    MdKeyboardDoubleArrowLeft,
    MdGroups,
    MdLogout,
    MdOutlineMenu,
  } from "react-icons/md";
  import { FaWpforms  } from "react-icons/fa";
  import { PiMotorcycleFill } from "react-icons/pi";
  import { useNavigate } from "react-router-dom";
  import "./BarSide.css";
  import EcoSathi from "../../assets/EcoSathi.png";

  function SideBar({ activePage }) {
    const [visitorShowSubmenu, setVisitorShowSubmenu] = useState(false);
    const [tempIDShowSubmenu, setTempIDShowSubmenu] = useState(false);
    const [vehicleLogShowSubmenu, setVehicleLogShowSubmenu] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState({
    "name": "User",
    "email": "user@gmail.com",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const barSideRef = useRef(null);
    const navigate = useNavigate();
    const [isSidebarVisible, setIsSidebarVisible] = useState(
      window.innerWidth > 550
    ); // State to control sidebar visibility
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 550); // Check if the screen is small

    const svgSize = 21;

    // useEffect(() => {
    //   const fetchUserData = async () => {
    //     setLoading(true);

    //     try {
    //       const token = localStorage.getItem("token");

    //       if (!token) {
    //         setError("No token found.");
    //         return;
    //       }

    //       const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
    //       setUser({
    //         name: payload.name,
    //         email: payload.email,
    //       });
    //     } catch (err) {
    //       console.error("Error decoding token:", err);
    //       setError("Failed to load user data.");
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   fetchUserData();

    //   // Add event listener to track window resize and toggle sidebar based on screen width
    //   const handleResize = () => {
    //     const isCurrentSmallScreen = window.innerWidth <= 550;
    //     setIsSmallScreen(isCurrentSmallScreen);

    //     if (isCurrentSmallScreen) {
    //       setIsSidebarVisible(false); // Hide sidebar on small screens
    //     } else {
    //       setIsSidebarVisible(true); // Show sidebar on larger screens
    //     }
    //   };

    //   window.addEventListener("resize", handleResize); // Listen for window resize
    //   handleResize(); // Call handleResize initially to set the correct state based on the initial screen size

    //   // Cleanup listener on unmount
    //   return () => {
    //     window.removeEventListener("resize", handleResize);
    //   };
    // }, []);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
      setIsSidebarVisible((prev) => !prev);
      setIsSidebarOpen(true);
      activePage.includes("visitor")
        ? setVisitorShowSubmenu(true)
        : setVisitorShowSubmenu(false);
      activePage.includes("tempID")
        ? setTempIDShowSubmenu(true)
        : setTempIDShowSubmenu(false);
    };

    useEffect(() => {
      // Function to handle clicks outside the element
      const handleClickOutside = (event) => {
        if(isSmallScreen){
        if (barSideRef.current && !barSideRef.current.contains(event.target)) {
          setIsSidebarVisible(false);
          setIsSidebarOpen(false);
        }
      }
      };

      // Attach event listener
      document.addEventListener("mousedown", handleClickOutside);
      
      // Cleanup event listener when component unmounts
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleLogout = () => {
      {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    const getInitials = (name) => {
      const words = name.split(" ").filter(Boolean); // Split the name by spaces and filter out any empty strings

      // Check if there are at least two words
      if (words.length > 1) {
        const firstInitial = words[0][0]; // First word's first character
        const lastInitial = words[words.length - 1][0]; // Last word's first character
        return `${firstInitial}${lastInitial}`.toUpperCase(); // Combine and convert to uppercase
      }

      // If there's only one word, just return its initial
      return words[0][0].toUpperCase();
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!user) {
      return <div>No user data available.</div>;
    }

    return (
      // <nav className="box-border h-screen w-[250px] py-[5px] px-[1em] bg-[">
      <>
        {isSmallScreen && (
          <div className="menu-toggle">
            <button onClick={toggleSidebar} className="">
              <MdOutlineMenu size={24} />
            </button>
          </div>
        )}

        {isSidebarVisible && (
          <nav id="sidebar" ref={barSideRef} className={`${isSidebarOpen ? "" : "close"}`}>
            <ul>
              <li>
                <img
                  className={`logo${isSidebarOpen ? "" : "-close"}`}
                  src={EcoSathi}
                />
                <button
                  id="toggle-btn"
                  className={`${isSidebarOpen ? "" : "rotate"}`}
                  onClick={() => {
                    setIsSidebarOpen((curr) => !curr);
                  }}
                >
                  <MdKeyboardDoubleArrowLeft size={svgSize * 1.2} />
                </button>
              </li>
              <li className={`${
                              activePage === "userDashboard" ? "active" : ""
                            }`}>
                <a onClick={() => navigate(`/user/dashboard`)}>
                  <MdOutlineDashboard size={svgSize} />
                  <span className="outer-li">Dashboard</span>
                </a>
              </li>
              <li className={`${
                              activePage === "registerComplaint" ? "active" : ""
                            }`}>
                <a onClick={() => navigate(`/user/register`)}>
                  <FaWpforms size={svgSize} />
                  <span className="outer-li">Register Complaint</span>
                </a>
              </li>
              <li className={`${
                              activePage === "garbageCollector" ? "active" : ""
                            }`}>
                <a onClick={() => navigate(`/collector/dashboard`)}>
                  <FaPersonMilitaryPointing size={svgSize} />
                  <span className="outer-li">Dashboard</span>
                </a>
              </li>
              <li className={`${
                              activePage === "garbageDetails" ? "active" : ""
                            }`}>
                <a onClick={() => navigate(`/collector/details`)}>
                  <FaPersonMilitaryPointing size={svgSize} />
                  <span className="outer-li">Details</span>
                </a>
              </li>
            </ul>
            <div className={`user-profile${isSidebarOpen ? "" : "-collapsed"} ${isSmallScreen ? "pt-2" : ""}`}>
              <div className="user-profile-initails">
                {getInitials(user.name)}
              </div>
              <div
                className={`user-profile-details ${
                  isSidebarOpen ? "" : "collapsed"
                }`}
              >
                <div className="user-profile-details-texts text-sm">
                  <h4>{user.name}</h4>
                  <div className="user-profile-details-texts-email">
                    {user.email}
                  </div>
                </div>
                <button onClick={() => handleLogout()} className="logout-button">
                  <MdLogout size={20} className="logout-icon" />
                </button>
              </div>
            </div>
          </nav>
        )}
      </>
    );
  }

  export default SideBar;
