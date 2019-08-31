const mongoose = require('mongoose');
const userConversation = mongoose.Schema({
    participants:[
        {
            senderId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
            receiverId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
        }
    ]
})

module.exports = mongoose.model('Conversation',userConversation);