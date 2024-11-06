const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");

const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});


const validateListing=(req,res,next) => {
  console.log("Request Body:",req.body);
    let {error}=listingSchema.validate({listing:req.body});
    if(error){
      console.error("Validation Error:",error.details);
      throw new ExpressError(400,error.details.map(e=>e.message).join(','));
    }
    else{
      next();
    }
  };



//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    let bata= await Listing.find({});// vo data h jo umne listings me se find kiya h 
    res.render("listschemafol/list.ejs",{bata});//listings ke liye humne listschemafol naam ka folder bana liya jo ki hum 
    //view folder lo aur aage users ke liye use kr ske
  }));
  //New route show route se upar rakhna hamesha
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listschemafol/new.ejs");
});
  //SHow route//.populate("reviews") se uski sari detail a jayegi
  router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
   let fbi =await Listing.findById(id).populate({path:"reviews",populate:{
    path:"author",///iska matlab h ki review ke sath hum populate kr rahe h aur jisme author ko bhi populate kr rahe h
   },}).populate("owner");//fbi=data obtained by find by id 
    if(!fbi){
   req.flash("error"," Listing you requested for does not exist");
   res.redirect("/listings");
    };
   // console.log(fbi);

   res.render("listschemafol/show.ejs",{fbi});
  }));
  //Create route ke liye

router.post("/",//validateListing,
  isLoggedIn,upload.single("listing[image]"),wrapAsync(async (req,res,next)=>{
  
  //let {title,description,image,price,place,country}=req.body.listing;
  
   //letnewListing= new Listing({
   //title:title,
   //description:description,
   //owner:req.user._id,
   // image:image,
   // price:price,
   // place:place,
    //country:country,
  //});
  //let url=req.file.path;
  //let filename=req.file.filename;
  
   const newListing= new Listing(req.body.listing);
   newListing.owner=req.user._id;
   if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
   //newListing.image={url,filename};
    await newListing.save();//new data ko save karne ke liye saveData ko likha h kuch bhi likh sakte hain
    

   req.flash("success","New Listing Created");
   res.redirect("/listings");

}));
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
  let {id}=req.params;
  let bfi = await Listing.findById(id);//bfi kuch bhi let kr liya 
   
   //let originalImageUrl=bfi.image.url;
   //originalImageUrl.replace("/upload","/upload/h_300,w_250");
   //these both are used for if i want to change inthe image so by doing this i can do change 
  res.render("listschemafol/edit.ejs",{bfi});
}));
//Update route
router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),
//validateListing,
wrapAsync(async (req,res,next)=>{
  let {id}=req.params;
  let{price:nprice,title:ntitle,description:ndescription,location:nlocation,country:ncountry}=req.body;
  let updatedlisting=await Listing.findByIdAndUpdate(id,{$set:{price:nprice,title:ntitle,description:ndescription,location:nlocation,country:ncountry}},{runvalidators:true,new:true});
  if(typeof req.file!== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    await updatedlisting.save();
  }
  req.flash("success","Listing Updated");
  console.log(updatedlisting);
  res.redirect("/listings");
}));
//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
  let {id}=req.params;
  let deletedlisting= await Listing.findByIdAndDelete(id);
  console.log("listing deleted");
  req.flash("success","Listing Deleted");
  res.redirect( "/listings");
}));


module.exports=router;
