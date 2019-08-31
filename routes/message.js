const express = require('express');
const router = express.Router();

const {sendMessage,getAllMessages} = require('../controllers/message');
const {verifyToken} = require('../helpers/auth');

router.get('/sendmessage/:senderid/:receiverid',verifyToken,getAllMessages);
router.post('/sendmessage/:senderid/:receiverid',verifyToken,sendMessage);

module.exports = router;