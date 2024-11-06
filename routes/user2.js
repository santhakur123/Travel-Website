const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const { savedRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" ,async (req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    //User.register  data store karana ke liye h jese ki yaha ye username or password store kareyga
    //aur ye khud se hi check kr lega ki ye naya user h ya purana 
    //humko kuch function likhne ki jarurat nahi h usko check karne ke liye ki ye naya h ya purana user
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","Welcome to Hunter2Lost");
         res.redirect("/listings");

    })
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    //try and ctch se ye hoga ki jb koi same username se register karega to vo 
    //username exist karke flash kara dega message 
    //aur doobara se signup karne ke liye bolega
});

//login routes ke liye 
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",
    savedRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
    //ye usko match karne ke liye h ki same use rh ki nahi agar 
    //same user h jiska data save h to vo login hoga warna nahi hoga
async (req,res)=>{
    req.flash( "success","Welcome to Hunter2lost");
    let redirectUrl=res.locals.redirectUrl || "/listings";
//iska matlab ye h ki agar locals ke andar req.session.redirectUrl exists karta h to usko redirect kara do warna listings  ko redirect kara do
    res.redirect(redirectUrl);

});
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","LoggedOut");
        res.redirect("/listings");
    });
});

module.exports=router;