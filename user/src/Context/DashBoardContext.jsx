
import React, { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("daily");

  // Function to calculate total revenue from orders
  const calculateTotalRevenue = (ordersData) => {
    if (!Array.isArray(ordersData)) {
      console.warn(
        "calculateTotalRevenue received non-array orders:",
        ordersData
      );
      return 0;
    }

    return ordersData.reduce((sum, order) => {
      if (!Array.isArray(order.items)) {
        console.warn("Order items is not an array for order:", order);
        return sum;
      }

      const orderTotal = order.items.reduce((orderSum, item) => {
        const foodItem = food_list.find(
          (f) => f.name.toLowerCase() === item.name.toLowerCase()
        );
        const price = foodItem ? foodItem.price : 0;
        const quantity = item.quantity || 1;
        return orderSum + price * quantity;
      }, 0);
      return sum + orderTotal;
    }, 0);
  };

  // Function to calculate order summary statistics
  const calculateOrderSummary = (ordersData) => {
    if (!Array.isArray(ordersData)) {
      console.warn(
        "calculateOrderSummary received non-array orders:",
        ordersData
      );
      return { totalDineIn: 0, totalTakeaway: 0, totalOrdersDone: 0 };
    }

    let totalDineIn = 0;
    let totalTakeaway = 0;
    let totalOrdersDone = 0;

    // function to parse order time string into a Date object
    const parseOrderTime = (timeStr) => {
      if (!timeStr) return null;
      const [time, meridian] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (meridian === "PM" && hours !== 12) hours += 12;
      if (meridian === "AM" && hours === 12) hours = 0;

      const now = new Date();
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );
    };

    ordersData.forEach((order) => {
      if (order.orderType === "Dine In") totalDineIn++;
      else if (order.orderType === "Take Away") totalTakeaway++;

      // Calculate preparation time
      let totalPreparationTime = 0;
      if (Array.isArray(order.items)) {
        order.items.forEach((orderItem) => {
          const foodItem = food_list.find(
            (item) => item.name.toLowerCase() === orderItem.name.toLowerCase()
          );
          if (foodItem) {
            const menuItem = menu_list.find(
              (item) => item.menu_name === foodItem.category
            );
            if (menuItem) {
              totalPreparationTime += menuItem.time * orderItem.quantity;
            }
          }
        });
      }

      const createdAt = parseOrderTime(order.orderTime);
      if (!createdAt) return;

      const now = new Date();
      const elapsed = Math.floor((now - createdAt) / 60000);
      const remainingTime = Math.max(totalPreparationTime - elapsed, 0);

      // If remaining time is 0 or less, consider the order done
      if (remainingTime <= 0) {
        totalOrdersDone++;
      }
    });

    return { totalDineIn, totalTakeaway, totalOrdersDone };
  };

  // Effect hook to fetch data when the component mounts
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("https://resturant-app-ss.onrender.com/api/food/orders")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            return data;
          } else {
            console.error(
              "API /api/food/orders did not return an array:",
              data
            );
            return [];
          }
        }),
      fetch("https://resturant-app-ss.onrender.com/api/food")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            return data;
          } else {
            console.error(
              "API /api/food did not return an array for userDetails:",
              data
            );
            return [];
          }
        }),
    ])
      .then(([ordersData, userDetailsData]) => {
        setOrders(ordersData);
        setUserDetails(userDetailsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
        setOrders([]);
        setUserDetails([]);
      });
  }, []);

  const totalRevenue = calculateTotalRevenue(orders);
  const totalOrders = orders.length;
  const uniqueClients = new Set(userDetails.map((u) => u.number)).size;
  const { totalDineIn, totalTakeaway, totalOrdersDone } =
    calculateOrderSummary(orders);

  return (
    <DashboardContext.Provider
      value={{
        orders,
        userDetails,
        loading,
        totalRevenue,
        totalOrders,
        totalClients: uniqueClients,
        totalDineIn,
        totalTakeaway,
        totalOrdersDone,
        food_list,
        menu_list,
        view,
        setView,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
