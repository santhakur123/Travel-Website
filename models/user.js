const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
   // username and password automatically define by passport-local-mongoose
   //so we not need to define them, in schema
});

userSchema.plugin(passportLocalMongoose);//ye username,password,hashing wagera sb automatically apply kr dega
//you can use this from passport website from passportlocalmongoose

const User=mongoose.model("User",userSchema);

module.exports= User;