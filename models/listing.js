const mongoose=require("mongoose");
const Schema= mongoose.Schema;


const listingSchema= new Schema({
    title:{
      type:  String,
      // required:true,//iska mtlb hamesa hoga NOT NULL hoga
    },
    description:String,
    image:{
        url:String,
        filename:String,
      
        
      
    },//ye ek ternary operator h if else ki tarah or ye default image set karne ke liye h 
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
     category:{
       type:String,
       enum:["Trending","Arctic Pools","Bed","Farms","TreeHouse","Tropical","Camping","Rooms","Iconic Cities"]
     }
});
const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;