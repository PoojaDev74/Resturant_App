const mongoose = require("mongoose");

const TableSchema = mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },

}, {timestamps:true});


const Tables = new mongoose.model("Tables", TableSchema);

module.exports = Tables;