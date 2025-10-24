const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connection established")
}).catch((err)=>{
    console.log(`Error is : ${err}`)
})
 
