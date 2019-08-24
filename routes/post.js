const express = require('express');
const router = express.Router();

const { addPost, getAllPosts,postLike,addComment, getSinglePost } = require('../controllers/post');
const { verifyToken } = require('../helpers/auth');

router.post('/post', verifyToken, addPost);
router.get('/post', verifyToken, getAllPosts);
router.post('/postlike',verifyToken,postLike);
router.post('/postcomment',verifyToken,addComment);
router.get('/post/:postId',verifyToken,getSinglePost)

module.exports = router;