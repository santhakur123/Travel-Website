const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/hunter2lost');
  
  };
  const initDB= async () =>{
    await Listing.deleteMany({});//jo phele se koi data ho usko delete karne ke liye
     initData.data=initData.data.map((obj)=>({...obj ,owner: '66f4f58777785c48db18b2d3'}));
    await Listing.insertMany(initData.data);
    console.log("data inserted");
  };
  initDB();//
  //map function jo h vo array banata h to jo data h usko array ke roop me save karega