import React, { useRef, useState } from "react";
import "./SwipeOrder.css";

const SwipeOrder = ({
  mostRecentUserInfo,
  showForm,
  sendOrderToBackend,
  navigate,
  setSwiped,
}) => {
  const buttonWidth = 320;
  const circleWidth = 50;
  const swipeThreshold = buttonWidth * 0.6;

  const [swipeSuccess, setSwipeSuccess] = useState(false);
  const [circleLeft, setCircleLeft] = useState(5);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  if (!mostRecentUserInfo) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const distance = touchEndX.current - touchStartX.current;

    if (distance >= swipeThreshold) {
      setSwipeSuccess(true);
      setCircleLeft(buttonWidth - circleWidth - 5);
      setSwiped(true);
      setTimeout(() => {
        sendOrderToBackend();
        navigate("/placeorder");
      }, 700);
    } else {
      setCircleLeft(5); 
    }
  };

  return (
    <div className="swipeContainer">
 <div
  style={{
    width: buttonWidth,
    height: 70,
    borderRadius: 30,
    position: "relative",
    overflow: "hidden",
    touchAction: "pan-y",
  }}
  className={`swipe-button ${!mostRecentUserInfo || showForm ? "disabled" : "active"}`}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>

      <div
        style={{
          width: circleWidth,
          height: circleWidth,
          borderRadius: "50%",
          backgroundColor: "#949494",
          position: "absolute",
          top: 5,
          left: circleLeft,
          transition: "left 0.3s ease",
        }}
        className="circle"
      >
        <span className="arrow-icon">→</span>
      </div>
      <span className="swipe-text">Swipe to Order</span>
    </div>
    </div>
  );
};

export default SwipeOrder;
