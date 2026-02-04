const ownermodel = require('../database/models/owner.model');
const jwt=require('jsonwebtoken');

async function authmiddleware(req,res,next){
    
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unauthorized: No token provided'});
    
}

    try{
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        const owner=await ownermodel.findById(verify.id);
        if(!owner){
            return res.status(401).json({message:'Unauthorized: User not found'});
        }
        req.owner=owner;
        next(); 
    }catch(err){
        return res.status(401).json({message:'Unauthorized: Invalid token'});
    }}

    module.exports=authmiddleware;