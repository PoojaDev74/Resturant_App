
import React, { createContext, useState, useEffect, useContext } from "react";
import { DashboardContext } from "./DashBoardContext";
import { food_list, menu_list } from "../assets/assets";


export const TableContext = createContext(null);

export const TableProvider = ({ children }) => {
  const { orders, loading } = useContext(DashboardContext);

  const [tables, setTables] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  const parseOrderTime = (isoString) => {
    return isoString ? new Date(isoString) : null;
  };

  const calculateRemainingTime = (order) => {
    if (!order || !order.orderCreatedAt || !Array.isArray(order.items))
      return 0;

    let totalPrepTime = 0;

    order.items.forEach((item) => {
      const foodItem = food_list.find(
        (f) => f.name.toLowerCase() === item.name.toLowerCase()
      );
      if (foodItem) {
        const menuItem = menu_list.find(
          (m) => m.menu_name === foodItem.category
        );
        if (menuItem) {
          totalPrepTime += menuItem.time * item.quantity;
        }
      }
    });

    const createdAt = parseOrderTime(order.orderCreatedAt);
    if (!createdAt) return 0;

    const elapsed = Math.floor((new Date() - createdAt) / 60000);
    return Math.max(totalPrepTime - elapsed, 0);
  };

  const fetchTables = async () => {
    try {
      const res = await fetch("https://resturant-app-ss.onrender.com/api/food/tables");
      const data = await res.json();

      const updated = data.map((table) => {
        const existing = tables.find((t) => t._id === table._id);
        if (existing && existing.manualOverride) {
          return existing;
        }
        return { ...table, status: "available" };
      });


      orders.forEach((order) => {
        if (order.orderType === "Dine In" && order.table) {
          const tableNumber = parseInt(order.table);
          const index = updated.findIndex(
            (t) => parseInt(t.tableNumber) === tableNumber
          );
          if (index !== -1) {
            const remainingTime = calculateRemainingTime(order);
            if (remainingTime > 0) {
              updated[index].status = "reserved";
            } else {
              updated[index].status = "available";
            }
          }
        }
      });

      setTables(updated);
    } catch (err) {
      console.error("Failed to fetch tables", err);
    }
  };

  useEffect(() => {
    if (!loading && Array.isArray(orders)) {
      fetchTables();
      const interval = setInterval(fetchTables, 60000);
      return () => clearInterval(interval);
    }
  }, [orders, loading]);

  const filteredTables = searchInput
    ? tables.filter((table) =>
      (table.name || `Table ${table.tableNumber}`)
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    )
    : tables;

  const contextValue = {
    tables: filteredTables,
    setTables,
    searchInput,
    setSearchInput,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};
