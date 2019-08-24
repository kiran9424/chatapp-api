const express = require('express');
const router  = express.Router();

const {getAllUser,getUserById,getUserByName} = require('../controllers/user');
const {verifyToken} = require('../helpers/auth');

router.get('/people',verifyToken,getAllUser);
router.get('/people/:id',verifyToken,getUserById);
router.get('/peoplename/:username',verifyToken,getUserByName);

module.exports = router;