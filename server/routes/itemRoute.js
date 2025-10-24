const express = require("express");
const {addItem, listItem, deleteItem}= require("../controllers/itemController");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


const itemRoute = express.Router();

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,    
});

//image storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "avif"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({storage})
itemRoute.post("/add",upload.single("image"),addItem);
itemRoute.get('/list', listItem);
itemRoute.post('/delete', deleteItem)


module.exports = itemRoute