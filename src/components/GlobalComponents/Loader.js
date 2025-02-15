import React from "react";
import logo from "../../assets/CPLOGO.png"; // Adjust the path as needed

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={logo} alt="Logo" className="loader-logo" />
    </div>
  );
};

export default Loader;
