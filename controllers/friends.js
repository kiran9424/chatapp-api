const User = require('../models/user')

exports.followUser = (req, res) => {
  // method has been created by name followedUser
  const followedUser = async () => {
    await User.update(
      {
        _id: req.user._id,
        'following.userFollowed': { $ne: req.body.userFollowed }
      },
      {
        $push: {
          following: {
            userFollowed: req.body.userFollowed
          }
        }
      }
    );

    await User.update(
      {
        _id: req.body.userFollowed,
        'following.follower': { $ne: req.user._id }
      },
      {
        $push: {
          followers: {
            follower: req.user._id
          },
          notifications: {
            senderId: req.user._id,
            message: `${req.user.username} is now following you`,
            created: new Date(),
            viewprofile: false
          }
        }
      }
    )

  }

  // calling follwedUser
  followedUser().then(
    () => {
      res.status(200).json({ message: 'Following user now' })
    }).catch((err) => {
      res.status(200).json({ errors: 'cant follow user now' })
    })

}

exports.unFollowUser = (req, res) => {
  const unFollow = async () => {
    await User.update(
      {
        _id: req.user._id
      },
      {
        $pull: {
          following: {
            userFollowed: req.body.userFollowed
          }
        }
      }
    );

    await User.update(
      {
        _id: req.body.userFollowed
      },
      {
        $pull: {
          followers: {
            follower: req.user._id
          }
        }
      }
    );
  };

  unFollow().then(
    () => {
      res.status(200).json({ message: 'Unfollowed the user' })
    }).catch((err) => {
      res.status(200).json({ errors: 'cant follow user now' })
    })
}

exports.readNotification = async (req, res) => {

  if (!req.body.deleteNotifcation) {
    await User.updateOne(
      {
        _id: req.user._id,
        "notifications._id": req.params.id
      },
      {
        $set: { 'notifications.$.read': true }
      }

    ).then(
      () => {
        res.status(200).json({ message: 'notification marked as read' })
      }).catch((err) => {
        res.status(200).json({ errors: 'cant mark notification as read' })
      })
  } else {
    User.updateOne(
      {
        _id: req.user._id,
        "notifications._id": req.params.id
      },
      {
        $pull:
        {
          notifications: { _id: req.params.id }
        }
      }
    ).then(
      () => {
        res.status(200).json({ message: 'notification deleted successfully' })
      }).catch((err) => {
        res.status(200).json({ errors: 'cant delete notification ' })
      })
  }
}

exports.markAllNotificationsAsread = async (req, res) => {
  await User.update(
    {
      _id: req.user._id
    },
    { $set: { 'notifications.$[elem].read': true } },
    { arrayFilters: [{ 'elem.read': false }], multi: true }
  ).then(
    () => {
      res.status(200).json({ message: 'Marked as unread' })
    }).catch((err) => {
      res.status(200).json({ errors: 'cant delete notification ' })
    })
}