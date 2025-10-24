import React, { useEffect, useState } from "react";
import { menu_list, food_list } from "../../assets/assets";
import "./OrderItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faCircleCheck,
  faHourglassEnd,
} from "@fortawesome/free-solid-svg-icons";

const OrderItem = ({ order, tableInfo }) => {
  console.log("Incoming order:", order);

  const getOrderItems = () => order.items || [];

  const calculateOrderPreparationTime = () => {
    let calculatedTime = 0;
    const items = getOrderItems();

    items.forEach((orderItem) => {
      const foodItem = food_list.find(
        (item) => item.name.trim().toLowerCase() === orderItem.name.trim().toLowerCase()
      );
      console.log("Checking:", orderItem.name, "-> found:", foodItem?.category);
      if (foodItem) {
        const menuItem = menu_list.find(
          (item) => item.menu_name === foodItem.category
        );
        console.log(orderItem.name, foodItem?.category);

        if (menuItem) {
          calculatedTime += menuItem.time * orderItem.quantity;
        }
      }
    });

    console.log(calculatedTime);
    return calculatedTime;
  };

  const [remainingTime, setRemainingTime] = useState(
    calculateOrderPreparationTime()
  );
  const [statusText, setStatusText] = useState("Processing");
  const [pickupStatus, setPickupStatus] = useState("");

  const toISTTimeString = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  useEffect(() => {
    console.log("useEffect triggered", order);
    if (!order?.orderCreatedAt) return;

    const createdAt = new Date(order.orderCreatedAt);
    console.log("Parsed Order Time:", createdAt);

    if (!createdAt) {
      return;
    }

    const updateTime = () => {
      const now = new Date();
      const create = new Date(order.orderCreatedAt);
      const elapsed = Math.floor((now - create) / 60000);
      const totalPreparationTime = calculateOrderPreparationTime();
      const remaining = Math.max(totalPreparationTime - elapsed, 0);
      console.log("Elapsed:", elapsed, "Remaining:", remaining);

      setRemainingTime(remaining);

      if (remaining > 0) {
        setStatusText("Processing");
      } else {
        if (order.orderType === "Dine In") {
          setStatusText("Served");
        } else if (order.orderType === "Takeaway") {
          setStatusText(pickupStatus || "Select Pickup Status");
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    console.log("Parsed Order Time:");

    return () => clearInterval(interval);
  }, [order.orderCreatedAt, order.orderType, pickupStatus, order]);

  const handleDropdownChange = (e) => {
    setPickupStatus(e.target.value);
    setStatusText(e.target.value);
  };

  const getTotalItems = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="orderItemContainer">
      <div
        className={`orderItemCard  diffColor ${order.orderType === "Dine In" ? "dine-in" : "take-away"}
      ${
        remainingTime > 0
          ? "processing"
          : order.orderType === "Dine In"
            ? "served"
            : "done"
      }`}
      >
        <div className="orderHeader">
          <div className="orderSubHead">
            <p>
              <FontAwesomeIcon icon={faUtensils} className="Ordericon" />{" "}
              {order.orderId}{" "}
            </p>
            <p>Table-{tableInfo || "N/A"}</p>
            <p>{toISTTimeString(order.orderCreatedAt)}</p>
            <h4 className="totalitem">{getTotalItems()} Item</h4>
          </div>
          <div
            className={`ordertypeStatus ${remainingTime > 0 ? "processing" : order.orderType === "Dine In" ? "served" : "done"}`}
          >
            {order.orderType === "Dine In" ? (
              <div className="diffColor dine-in">
                <h6 className="diffColor">Dine In</h6>
                <p>
                  {remainingTime > 0
                    ? `Ongoing ${remainingTime} Min`
                    : "Served"}
                </p>
              </div>
            ) : (
              <div className="diffColor take-away">
                <h6>Take Away</h6>
                {remainingTime > 0 ? (
                  `Ongoing ${remainingTime} Min`
                ) : (
                  <select
                    className="orderSelect"
                    value={pickupStatus}
                    onChange={handleDropdownChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="Not Picked Up">Not Picked Up</option>
                  </select>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="orderItems">
          {order.items.map((item, i) => (
            <div className="p" key={i}>
              {item.quantity} x {item.name}
              {item.totalAmount}
            </div>
          ))}
        </div>

        <div
          className={`orderFooter ${remainingTime > 0 ? "processing" : order.orderType === "Dine In" ? "served" : "done"}`}
        >
          {remainingTime > 0 ? (
            <div className="statusBottom processing">
              Processing <FontAwesomeIcon icon={faHourglassEnd} />
            </div>
          ) : (
            <div className="statusBottom done">
              {" "}
              Order Done <FontAwesomeIcon icon={faCircleCheck} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
