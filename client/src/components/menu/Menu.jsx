import React { useRef } from "react";
import { menu_list } from "../../assests/assets";
import "./Menu.css";

const Menu = ({ onCategoryClick, activeCategory }) => {
  const scrollRef = useRef(null);
  return (
    <div className="menu-box" ref={scrollRef}>
      {menu_list.map((item, index) => {
        return (
          <div
            key={item.menu_name}
            className={`single-box ${activeCategory === item.menu_name ? "active" : ""}`}
            onClick={() => {
              onCategoryClick(item.menu_name);
            }}
          >
            <img src={item.menu_image} alt="logo" />
            <p>{item.menu_name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
