const foodModal = require("../models/foodModal");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;



//add food item

const addItem = async(req,res)=>{
 try {
    const result = await cloudinary.uploader.upload(req.file.path, { folder: "uploads" });

const item = new foodModal({
    name: req.body.name,
    price:req.body.price,
    category:req.body.category,
        image: result.secure_url,
      cloudinary_id: result.public_id,
})
await item.save();
res.json({success:true, message:"item added"})
}catch(error){
console.log(error)
res.json({success:false, message:"Error"})
}
}

//item list
const listItem = async(req,res)=>{
    try{
const items = await foodModal.find({});
res.json({success:true, data:items})
    }catch(error){
console.log(error);
res.json({success:false, message:"error"});
    }

}

//remove item

const deleteItem = async(req,res)=>{
    try{
const item = await foodModal.findById(req.body.id);
fs.unlink(`uploads/${item.image}`,()=>{})
await foodModal.findByIdAndDelete(req.body.id);
res.json({success:true, message:"item deleted"})
    }catch(error){
        console.log(error);
res.json({success:false, message:"Error"})

    }

}

module.exports = {addItem , listItem, deleteItem};