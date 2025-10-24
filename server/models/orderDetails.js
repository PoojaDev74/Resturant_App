const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  orderId: String,
  table: String,
  time: String, 
  items: [
    {
      name: String,
      quantity: Number,
      category: String,
    }
  ],
  orderType: {
    type: String, 
      enum: ["Dine In", "Take Away"], 
    required: true

  },
    totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String, 
     enum: ["Processing", "Served", "Not Picked up"], 
    default: "Processing"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Order", orderSchema);