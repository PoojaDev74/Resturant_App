import React, { useEffect, useState } from "react";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/cart");
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="order-screen">
      <div className="order-content">
        <h2>Thanks For Ordering</h2>
        <div className="order-confirm">
          <span>✔</span>
        </div>
        <p className="redirect-text">Redirecting in {countdown}</p>
      </div>
    </div>
  );
};

export default PlaceOrder;
