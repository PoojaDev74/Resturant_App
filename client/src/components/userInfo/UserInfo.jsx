import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userInfo.css";

const UserInfo = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    numberOfPersons: "",
    address: "",
    contact: "",
  });

  const navigate = useNavigate();

    useEffect(() => {
    // Check if user already filled the form
    const savedUser = localStorage.getItem("userDetails");
    if (savedUser) {
      onClose && onClose(); // skip modal if user already exists
    }
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userDetails", JSON.stringify(formData));
    if (onClose) onClose();
    navigate("/home"); 
  };

  return (
    <div className="user-overlay">
      <div className="user-modal">
        <h2 className="title">Enter Your Details</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
             value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Number of Person</label>
          <input
            type="text"
            name="numberOfPersons"
            placeholder="2, 4, 6"
            value={formData.numberOfPersons}
            onChange={handleChange}
          />

          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <label>Contact</label>
          <input
            type="tel"
            name="contact"
            placeholder="Phone Number"
            value={formData.contact}
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit mobile number"
            required
          />
          <button type="submit" className="order-btn">
            Order Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
