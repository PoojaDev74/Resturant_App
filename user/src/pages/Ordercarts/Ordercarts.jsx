import React, { useState, useContext } from "react";
import "./Ordercart.css";
import OrderItem from "../../components/OrderItem/OrderItem";
import { DashboardContext } from "../../Context/DashBoardContext";

const OrderCarts = () => {
  const { orders, userDetails, loading } = useContext(DashboardContext);
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <div>Loading order info...</div>;
  if (!orders || orders.length === 0) return <div>No orders available</div>;

  const filteredOrders = orders
    .filter((order) =>
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="ordersContainer">
      <input
        type="text"
        placeholder="Search by OrderID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input"
      />
      <div className="orderCards">
        <h2>Order Line</h2>
        <div className="Mainorder">
          <div className="SubContainer">
            {filteredOrders
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((order, index) => (
                <OrderItem
                  key={order._id}
                  order={order}
                  tableInfo={order.table}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCarts;
