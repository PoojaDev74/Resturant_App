const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const app = express();


const allowedOrigins = [
  "https://resturant-app-kappa.vercel.app",
  "https://resturant-app-ipbd.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "http://localhost:3005",
  "http://localhost:3006"
];


app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// Middleware
app.use(express.json());

// Port
const port = process.env.PORT || 4000;

app.get("/",(req,res)=>{

  console.log("hello")
    res.send("Hello World by Pooja!");

}) 

//Database connection
require("./DB/connection");


// Require Routes
const userDetails = require("./routes/userDetails");
const itemRoute = require("./routes/itemRoute");
const cartRouter = require("./routes/cartRoutes");
const tableRouter = require("./routes/tableRoutes")
// Routes
app.use("/api/food", userDetails);
app.use("/api/food", itemRoute)
app.use("/images", express.static('uploads'));
app.use("/api/food", cartRouter)
app.use("/api/food", tableRouter)


app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});
