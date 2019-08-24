const Post = require('../models/post');
const User = require('../models/user')
const JOI = require('joi');

exports.addPost = (req, res) => {

    const schema = JOI.object().keys({
        post: JOI.string().required()
    })
    const { error } = JOI.validate(req.body, schema);

    if (error && error.details) {
        return res.status(400).json({ msg: error.details });
    }

    const postDetails = {
        user: req.user._id,
        username: req.user.username,
        post: req.body.post,
        created: new Date()
    }

    Post.create(postDetails, async (err, result) => {
        if (err) {
            return res.status(400).json({ errors: 'Error while creating post' });
        }
        await User.update(
            {
                _id: req.user._id
            },
            {
                $push: {
                    posts:
                    {
                        postId: result._id,
                        post: req.body.post,
                        created: new Date()
                    }
                }
            }
        )
        return res.status(201).json({ message: 'Post created successfully', result });
    })

}

exports.getAllPosts = async (req, res) => {
    try {
        const post = await Post.find({}).populate('user').sort({ created: -1 });
        const topPosts = await Post.find({totalLikes:{$gte:2}}).populate('user').sort({created:-1})
        return res.status(200).json({ message: post,topPosts })

       
    } catch (error) {
        return res.status(200).json({ errors: 'No posts', error })
    }
}

exports.postLike = async (req, res) => {
    const postId = req.body._id;
    Post.update(
        { _id: postId, "likes.username": { $ne: req.user.username } },
        {
            $push: { likes: { username: req.user.username } },
            $inc: { totalLikes: 1 }
        }).then(() => {
            res.status(201).json({ message: 'You liked the post' })
        }).catch((err) => { errors: 'Cant able to like the post' })
}

exports.addComment = async (req, res) => {
    const postId = req.body.postId;
    await Post.update(
      {
        _id: postId
      },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.data,
            createdAt: new Date()
          }
        }
      }
    ).then(() => {
        res.status(201).json({ message: 'commented'})
    }).catch((err)=>{
        res.status(201).json({ errors: 'cant able to add comment' })
    })
}

exports.getSinglePost= async (req,res)=>{
    await Post.findOne({_id:req.params.postId})
    .populate('user')
    .populate('comments.userId')
    .then((post)=>{
        res.status(201).json({ message: 'Post fetched successfully',post })
    }).catch((err)=>{
        res.status(201).json({ errors: 'Post not found!!!' })
    })
}