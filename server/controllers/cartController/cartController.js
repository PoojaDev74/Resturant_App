const Order = require("../../models/orderDetails");


//  Fetch all orders
const listOrders = async (req, res) => {
  try {
    const ordersFromDB = await Order.find().sort({ createdAt: 1 });

    const formattedOrders = ordersFromDB.map((order , index) => {
     const createdAt = new Date(order.createdAt); // already UTC
      const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

      // Time-based status calculation
      const now = new Date();
      const diffInMinutes = Math.round((now - createdAt) / (1000 * 60));

       const generatedOrderId = (index + 1).toString().padStart(3, '0');
      let actionButtonText = "";
      let actionButtonIcon = "";
      let statusDetails = "";

      switch (order.status) {
        case "Processing":
          actionButtonText = "Processing";
          actionButtonIcon = "hourglass";
          statusDetails = `${diffInMinutes} Min`;
          break;
        case "Served":
        case "Not Picked up":
          actionButtonText = "Order Done";
          actionButtonIcon = "check-circle";
          break;
        default:
          actionButtonText = "Update Status";
          actionButtonIcon = "sync";
          break;
      }

      return {
        orderId: `#${generatedOrderId}`, 
        orderType: order.orderType,
        table: order.orderType === "Dine In" ? order.table : "N/A",
        orderTime: createdAt.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        orderCreatedAt: order.createdAt,
        itemCount: itemCount,
        items: order.items.map(item => ({
          quantity: item.quantity,
          name: item.name
        })),
        status: order.status,
        statusDetails,
        actionButtonText,
        actionButtonIcon
      };
    });

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching and formatting orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { table, items, orderType, status, totalAmount } = req.body;
  
    const newOrder = new Order({
      table,
      items,
      orderType,
      status,
      totalAmount,

    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

module.exports = {
  listOrders,
  createOrder,
};
