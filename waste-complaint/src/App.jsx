import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage_KJC/LoginPage.jsx";
import Register_Complaints from "./pages/Register_Complaints/Register_Complaints.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import GarbageReportForm from "./pages/GarbageReportForm.jsx";
import Collector_Dashboard from "./pages/Collector_Dashboard/GarbageCollector.jsx";
import Garbage_Details from "./pages/Garbage_Details/Garbage_Details.jsx";
import Empty_Page from "./pages/Empty_Page.jsx";

// Placeholder Unauthorized page (Replace with your actual component)
const UnauthorizedPage = () => <h2>Unauthorized Access</h2>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/register" element={<Register_Complaints />} />
        <Route path="/user/garbage-report" element={<GarbageReportForm />} />
        <Route path="/collector/dashboard" element={<Collector_Dashboard />} />
        <Route path="/collector/details" element={<Garbage_Details />} />
        
        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
