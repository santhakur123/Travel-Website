if(process.env.NODE_ENV !="production") {

require('dotenv').config();
};
console.log(process.env.SECRET);


const express=require("express");
const app = express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path =require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//ye database se connect karne ke liye h 
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const filtersRouter=require("./routes/filters.js");

const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");

const listingRouter=require("./routes/listing2.js");
const reviewRouter=require("./routes/review2.js");
const userRouter=require("./routes/user2.js");

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//taki jo request ke andar data a raha h vo parse ho jaye
app.use(methodOverride("_method"));//post ko put request me convert karne ke liye
app.engine("ejs",ejsMate);//for using ejsmate
app.use(express.static(path.join(__dirname,"/public")));






// 
const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('dbUrl');//mongodb://127.0.0.1:27017/hunter2lost
  
  };

  //yaha tk isko likhta h database se connect karne ke liye
  //using cookie options
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    secure:false,
    expires: Date.now() +7*24*60*60*1000,//iska matlab h ki jb bhi loi login karega to vo ek week tk uska data save rahega cookie ke roop me 
    maxAge:  7*24*60*60*1000,//ek hAFTE baad vo delete ho jayega agar vo login nahi karta to ek hafte tk
    
    
},
};


  //schema validation ke liye miiddleware define karne ke liye
  // const validateListing=(req,res,next) => {
  //   let{error}=listingSchema.validate(req.body);
  //   if(error){
  //     throw new ExpressError(400,error);
  //   }
  //   else{
  //     next();
  //   }
  // };
  // const validateReview=(req,res,next) => {
  //   let{error}=reviewSchema.validate(req.body);
  //   if(error){
  //     throw new ExpressError(400,error);
  //   }
  //   else{
  //     next();
  //   }
  // };


  // app.get("/testlisting", async (req,res)=>{
  //   let sampleListing = new Listing({
  //       title:"My New Villa",
  //       description:"By the beach",
  //       price:1200,
  //       location:"Halena road,Haryana",
  //       country:"India",

  //   });
  //   let Sl=await sampleListing.save();//Sl ka kuch bhi bana diya save karne ke liye
  //   console.log("Sample is saved");
  //  res.send("working sample");
  // });//

  
  app.use(session(sessionOptions));
  app.use(flash());
  

  app.use(passport.initialize());//seassionoptions ke baad hi likhna hoga
  app.use(passport.session());

  app.use((req,res,next)=>{
    console.log("Current user:", req.user);
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
     res.locals.currUser=req.user || null;
    next();
  });
  passport.use(new localStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());//mtlb ek login kr diya to usko baar barr nahi karna hoga
  passport.deserializeUser(User.deserializeUser());//ek baar logout kr dega to usko deserialize bolte h

//hamesha apne routes se phele likhna h 


//isse jo success wala message h vo flash ho jayega jb bhi new listing add karenge tb
app.use("/listings",filtersRouter);
  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);
  



  //index route
//   app.get("/listings",wrapAsync(async (req,res)=>{
//     let bata= await Listing.find({});// vo data h jo umne listings me se find kiya h 
//     res.render("listschemafol/list.ejs",{bata});//listings ke liye humne listschemafol naam ka folder bana liya jo ki hum 
//     //view folder lo aur aage users ke liye use kr ske
//   }));
//   //New route show route se upar rakhna hamesha
// app.get("/listings/new",(req,res)=>{
//   res.render("listschemafol/new.ejs");
// });
//   //SHow route//.populate("reviews") se uski sari detail a jayegi
//   app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//    let fbi =await Listing.findById(id).populate("reviews");//fbi=data obtained by find by id 
//    res.render("listschemafol/show.ejs",{fbi});
//   }));
//   //Create route ke liye

// app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
  
//   let {title,description,image,price,place,country}=req.body;
//   let newListing= new Listing({
//    title:title,
//    description:description,
//     image:image,
//     price:price,
//     place:place,
//     country:country,
//   });
  
//    let saveData = await newListing.save();//new data ko save karne ke liye saveData ko likha h kuch bhi likh sakte hain
//    res.redirect("/listings");

// }));
// //Edit route
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//   let {id}=req.params;
//   let bfi = await Listing.findById(id);//bfi kuch bhi let kr liya 


//   res.render("listschemafol/edit.ejs",{bfi});
// }));
// //Update route
// app.put("/listings/:id", wrapAsync(async (req,res)=>{
//   let {id}=req.params;
//   let{price:nprice}=req.body;
//   let updatedlisting=await Listing.findByIdAndUpdate(id,{price:nprice},{runvalidators:true});
//   console.log(updatedlisting);
//   res.redirect("/listings");
// }));
// //Delete route
// app.delete("/listings/:id",wrapAsync(async (req,res)=>{
//   let {id}=req.params;
//   let deletedlisting= await Listing.findByIdAndDelete(id);
//   console.log("listing deleted");
//   res.redirect( "/listings");
// }));

// //POST ROUTE 
// // isme phele to post request li h 
// //phir id ko require kiya h 
// app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   let revList= await Listing.findById(id);//listing ko access karne ke liye review wale me
  
//   let newReview=new Review(req.body.review
  
//   );//naya review create karne ke liye or usme review jisme rating or coomment h uskon pss kr denge
//   revList.reviews.push(newReview);//revList naam se humne us listing ko liya jo id se find ki thi 
// //revList ek koi listing h jiske andar humne reviews naam ki array banai h uske andar hum newreview ko push kara rahe h 
// //kyoki har listing ke pass ab review hoga jisme hum review ko add kr rahe h bs
//   await newReview.save();//database ke andar save kr denge
//   await revList.save();//database ke andar save kr denge

//   //console.log("new review saved");
//   //res.send("new review saved");
//   res.redirect(`/listings/${revList._id}`);
// }));
// //Delete Review Route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//       let {id,reviewId}=req.params;

//       await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
// //upar wale ka matlab ye h ki phele listing ke andar find kia id se or jo bhi review array se reviewId match kr jaye use pull mtlb remove kr de or update ho jaye
//       await Review.findByIdAndDelete(reviewId);

//       res.redirect(`/listings/${id}`);
// }));

 






//kisi bhi page ko request bhejne ke liye jisse ki hamara server crash na ho
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});
//Error handling error
app.use((err,req,res,next)=>{
  let{statusCode=505,message="Something Went wrong"}=err;
  res.render("error.ejs",{err});
  //  res.status(statusCode).send(message);
});



// app.get("/",(req,res)=>{
//     res.send("working");
// });
app.listen(8080,()=>{
    console.log("listening port");
});