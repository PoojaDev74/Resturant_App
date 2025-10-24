import React from "react";
import "./SideBar.css";
import { NavLink } from "react-router-dom";
import resturant-logo from "../../assests/assets";
const SideBar = () => {
  return (
    <header id="header" className="header">
      <div className="menuItem1">
        <div className="iconCircle1">
          <img
            src={resturant-logo}
            alt="Resturant-Logo"
            className="sidebar-logo"
          />
        </div>
      </div>
      <div className="menu">
        <div className="menuItem">
          <NavLink to="/" className="iconCircle">
            <i className="fas fa-grip"></i>
          </NavLink>
        </div>
        <div className="menuItem">
          <NavLink to="/Tables" className="iconCircle">
            <i className="fa-solid fa-chair"></i>
          </NavLink>
        </div>
        <div className="menuItem">
          <NavLink to="/Ordercarts" className="iconCircle">
            <i className="fa-solid fa-book"></i>
          </NavLink>
        </div>

        <div className="menuItem">
          <NavLink to="/MenuItems" className="iconCircle">
            <i className="fa-solid fa-chart-simple"></i>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default SideBar;
