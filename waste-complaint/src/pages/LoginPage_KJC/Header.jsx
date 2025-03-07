import React from "react";
import ecoSathiPic from "../../assets/EcoSathi.png"; // Correct import

function Header() {
  return (
    <div className="headerLogo" style={{backgroundColor: "#F0EBFA"}}>
      <div
        style={{
          width: "200px",
          height: "80px",
          backgroundImage: `url(${ecoSathiPic})`, // Corrected
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#F0EBFA",
          backgroundBlendMode: "multiply"
        }}
      />
    </div>
  );
}

export default Header;
