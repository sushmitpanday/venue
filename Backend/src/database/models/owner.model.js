const mongoose=require('mongoose');
const ownerSchema=new mongoose.Schema({
    fullname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    Password:{type:String,required:true},
},{timestamps:true});


module.exports=mongoose.model('Owner',ownerSchema);
