const User = require('../models/user');
const Message = require('../models/message');
const Conversation = require('../models/conversation');
const Helper = require('../helpers/helper')

exports.getAllMessages = async (req,res)=>{
    const{senderid,receiverid} = req.params

    const conversation = await Conversation.findOne({
        $or:[
            {
                $and:[
                    {'participants.senderId':senderid},
                    {'participants.receiverId':receiverid}
                ]
            },
            {
                $and:[
                    {'participants.senderId':receiverid},
                    {'participants.receiverId':senderid}
                ]
            }
        ]
    }).select('_id')

    if(conversation){
        const message = await Message.findOne({
            conversationId:conversation._id
        })
        return res.status(200).json({ message: 'messages fetched successfully', message })
        
    }
}

exports.sendMessage = (req, res) => {

    const { senderid, receiverid } = req.params;
    Conversation.find(
        {
            $or: [
                {
                    participants: {
                        $elemMatch: { senderId: senderid, receiverId: receiverid }
                    }
                },
                {
                    participants: {
                        $elemMatch: { senderId: receiverid, receiverId: senderid }
                    }
                }

            ]
        },
        async (err, result) => {
            if (result.length > 0) {
                const msg = await Message.findOne({conversationId:result[0]._id})
                Helper.updateChatList(req,msg)
                await Message.update({
                    conversationId: result[0]._id
                },
                    {
                        $push: {
                            messages: {
                                senderId: req.user._id,
                                receiverId: req.params.receiverid,
                                senderName: req.user.username,
                                receiverName: req.body.receiverName,
                                textMessage: req.body.textMessage
                            }
                        }
                    }
                ).then((result) => {
                    return res.status(200).json({ message: 'message sent successfully', result })
                })
                .catch((err) => {
                    return res.status(200).json({ errors: 'Failed to send', err })
                })
            } else {
                const newConversation = new Conversation();
                newConversation.participants.push({
                    senderId: req.user._id,
                    receiverId: req.params.receiverid
                })

                const saveConversation = await newConversation.save();
                const newMessage = new Message();
                newMessage.conversationId = saveConversation._id;
                newMessage.sender = req.user.username;
                newMessage.receiver = req.body.receiverName;
                newMessage.messages.push({
                    senderId: req.user._id,
                    receiverId: req.params.receiverid,
                    senderName: req.user.username,
                    receiverName: req.body.receiverName,
                    textMessage: req.body.textMessage
                })

                //message sender details
                await User.update(
                    {
                        _id: req.user._id,

                    },
                    {
                        $push: {
                            chatList: {
                                $each: [

                                    {
                                        receiverId: req.params.receiverid,
                                        msgId: newMessage._id
                                    }

                                ],
                                $position: 0

                            }
                        }
                    }
                )

                //message receiver details
                await User.update(
                    {
                        _id: req.params.receiverid,

                    },
                    {
                        $push: {
                            chatList: {
                                $each: [

                                    {
                                        receiverId: req.user._id,
                                        msgId: newMessage._id
                                    }

                                ],
                                $position: 0

                            }
                        }
                    }
                )

                await newMessage.save()
                    .then((result) => {
                        return res.status(200).json({ message: 'message sent successfully', result })
                    })
                    .catch((err) => {
                        return res.status(200).json({ errors: 'Failed to send', err })
                    })
            }
        }
    )
}