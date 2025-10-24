import React, { useContext, useState, useEffect } from "react";
import Searchbar from "../searchbar/Searchbar";
import Menu from "../menu/Menu";
import ItemDisplay from "../ItemDisplay/ItemDisplay";
import { ItemContext } from "../../context/itemsContext/itemsContext";
import "./Home.css";
import { Link } from "react-router-dom";
import UserInfo from "../userInfo/UserInfo";

const Home = () => {
  const { cart, clearSearch } = useContext(ItemContext);
  const [selectedItem, setSelectedItem] = useState("Coffee");
  const [previousSelectedItem, setPreviousSelectedItem] = useState("Coffee");
  const [user, setUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    if (!storedUser) {
      
      setShowUserForm(true);
    } else {
      setUser(storedUser);
    }
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedItem(category);
  };

  const isCartNotEmpty = Object.keys(cart).length > 0;

  useEffect(() => {
    if (selectedItem !== previousSelectedItem) {
      clearSearch();
      setPreviousSelectedItem(selectedItem);
    }
  }, [selectedItem, previousSelectedItem, clearSearch]);

  const handleUserSaved = () => {
    const saved = JSON.parse(localStorage.getItem("userDetails"));
    setUser(saved);
    setShowUserForm(false);
  };

  const handleChangeUser = () => {
    localStorage.removeItem("userDetails");
    setShowUserForm(true);
  };

  return (
    <>
      <div className={`home ${showUserForm ? "blurred" : ""}`}>
        {/* Welcome Banner */}
        {user && (
          <div className="welcomeBanner">
            <h2>Welcome, {user.name || "Guest"} 👋</h2>
            <p>
              Table No: <strong>{user.numberOfPersons || "N/A"}</strong> •{" "}
              Contact: <strong>{user.contact || "Not Provided"}</strong>
            </p>
          </div>
        )}

        <Searchbar />
        <Menu
          onCategoryClick={handleCategoryChange}
          activeCategory={selectedItem}
        />
        <ItemDisplay category={selectedItem} />
      </div>

      {/* Overlay modal form */}
      {showUserForm && <UserInfo onClose={handleUserSaved} />}

      {/* Next Button (to Cart) */}
      <div className="next-button">
        {isCartNotEmpty && (
          <Link to="/cart">
            <button className="next">Next</button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Home;
