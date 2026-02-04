const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    fullname:{
        require:true,
        type:String
    },
    email:
    {
        type:String,
        require:true,
        unique:true
    },
    Password:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

const usermodel=mongoose.model("user",userSchema)

module.exports=usermodel