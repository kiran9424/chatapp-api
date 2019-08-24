const Joi = require('joi');
const User = require('../models/user');
const Helper = require('../helpers/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.signup = async  (req,res)=>{
    const schema = Joi.object().keys({
        username:Joi.string()
                    .min(3)
                    .max(30)
                    .required(),
        email:Joi.string().email({minDomainAtoms:2}),
        password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    });

    const {error,value} = Joi.validate(req.body,schema);

    if(error && error.details){
        return res.status(400).json({msg:error.details});
    }

    const userEmail = await User.findOne({email:Helper.emailToLowerCase(req.body.email)});
    if(userEmail){
        return res.status(400).json({errors:'Email already exists'});
    }

    const userName = await User.findOne({username:Helper.firstLetterToUpperCase(req.body.username)});
    if(userName){
        return res.status(400).json({errors:'User already exists'}); 
    }

    return bcrypt.hash(req.body.password,10,(err,hashedPassword)=>{
        if(err){
            return res.status(400).json({errors:'issue with password'});
        }

        const user ={
            username: Helper.firstLetterToUpperCase(req.body.username),
            email:Helper.emailToLowerCase(req.body.email),
            password:hashedPassword
        }

        User.create(user,(err,userResult)=>{
            if(err){
                return res.status(400).json({errors:'Something went wrong please try again later'});
            }
            const token = jwt.sign({data:userResult},process.env.SECRET,{expiresIn:'1h'})
            res.cookie('auth',token)
             return res.status(201).json({message:'User has been created successfully',userResult,token});
        })
    })
    
        
}

exports.signin = async (req,res)=>{
    if(!req.body.username || !req.body.password){
        return res.status(400).json({errors:'Username and Password is required!!!'});
    }
    await User.findOne({username:Helper.firstLetterToUpperCase(req.body.username)},(err,user)=>{
        if(!user || err){
            return res.status(400).json({errors:'User not found.'});
        }

        return bcrypt.compare(req.body.password,user.password,(err,password)=>{
            if(!password || err){
                return res.status(400).json({errors:'wrong password'});
            }

            const token = jwt.sign({data:user},process.env.SECRET,{expiresIn:'1h'})
            res.cookie('auth',token)

            return res.status(200).json({message:'login successfull',user,token});
        })
    })
}