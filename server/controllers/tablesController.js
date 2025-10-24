const Tables = require("../models/tablesModal");

//Get data
const getTables = async (req, res) => {
  try {
    const tablesData = await Tables.find().sort({ createdAt: 1 });
    res.status(200).json(tablesData);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

//Post tables
const postTables = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { tableNumber } = req.body;

    const tableInfo = new Tables({ tableNumber });
    const tableData = await tableInfo.save();
    res.status(200).json(tableData);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

//Delete
const deleteTables = async (req, res) => {
  try {
    const item = await Tables.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }

    res.json({ success: true, message: "Table deleted", deleted: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  getTables,
  postTables,
  deleteTables
};
