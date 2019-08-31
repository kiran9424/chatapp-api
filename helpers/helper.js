const User = require('../models/user')
module.exports ={
    firstLetterToUpperCase: username=>{
        const name = username.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    },
    emailToLowerCase : email =>{
        return email.toLowerCase();
    },
    updateChatList: async (req, message) => {
    await User.update(
      {
        _id: req.user._id
      },
      {
        $pull: {
          chatList: {
            receiverId: req.params.receiverid
          }
        }
      }
    );

    await User.update(
      {
        _id: req.params.receiverid
      },
      {
        $pull: {
          chatList: {
            receiverId: req.user._id
          }
        }
      }
    );

    await User.update(
      {
        _id: req.user._id
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.params.receiverid,
                msgId: message._id
              }
            ],
            $position: 0
          }
        }
      }
    );

    await User.update(
      {
        _id: req.params.receiverid
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.user._id,
                msgId: message._id
              }
            ],
            $position: 0
          }
        }
      }
    );
  }

}