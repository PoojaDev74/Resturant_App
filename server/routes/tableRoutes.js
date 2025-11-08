const express = require("express");

// const Tables = require("../models/tablesModal")

//Require Controller
const { getTables, postTables,deleteTables}=  require("../controllers/tablesController")


const tableRouter = express.Router();


//GET Group Data
tableRouter.get("/tables", getTables);
tableRouter.post("/tables",postTables);
tableRouter.delete("/tables/:id", deleteTables)


module.exports = tableRouter;
