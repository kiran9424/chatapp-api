const User = require('../models/user')

exports.getAllUser = async (req,res)=>{

    await User.find({})
    .populate('posts.postId')
    .then((user)=>{
        return res.status(200).json({message:user})
    }).catch((err)=>{
        return res.status(400).json({errors:'Users not found',err})
    })

}

exports.getUserById = async (req,res)=>{
    await User.findOne({_id:req.params.id})
    .populate('following.userFollowed')
    .populate('followers.follower')
    .populate('chatList.receiverId')
    .populate('chatList.msgId')
    .then((user)=>{
        return res.status(200).json({message:'User fetched successfully',user});
    }).catch((err)=>{
        return res.status(400).json({errors:'Users not found',err});
    })
}

exports.getUserByName = async (req,res)=>{
    await User.findOne({username:req.params.username})
    .populate('following.userFollowed')
    .populate('followers.follower')
    .populate('chatList.receiverId')
    .populate('chatList.msgId')
    .then((user)=>{
            return res.status(200).json({message:'User fetched successfully',user});
    }).catch((err)=>{
        return res.status(400).json({errors:'Users not found',err});
    })
}