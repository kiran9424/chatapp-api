const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken =(req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(403).json({errors:'Unauthorized user'})
    }
    const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(404).json({errors:'Token not found'})
    }

    return jwt.verify(token,process.env.SECRET,(err,foundToken)=>{
        if(err){
            if(err.expiredAt < new Date()){
                return res.status(403).json({errors:'Session expired please login',token:null})
            }
            next();
        }
        req.user = foundToken.data;
        next();
    })
}