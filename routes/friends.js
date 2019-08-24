const express = require('express');
const router =express.Router();

const {followUser,unFollowUser,readNotification,markAllNotificationsAsread} = require('../controllers/friends');
const {verifyToken} = require('../helpers/auth');

router.post('/followuser',verifyToken,followUser);
router.post('/unfollowuser',verifyToken,unFollowUser);
router.post('/marknotification/:id',verifyToken,readNotification);
router.post('/markallasread',verifyToken,markAllNotificationsAsread)

module.exports = router;