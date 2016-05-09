'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

var postSchema = new mongoose.Schema({
    body: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

postSchema.statics.post = function(postObj, cb) {
    this.create(postObj, (err, post) => {
        if (err) return cb(err);
        cb(null, post);
    });
};
postSchema.statics.liked = function(userId, postId, cb) {
    this.findById(postId, (err, post) => {
        console.log('post: ', post);
        var index = post.likes.indexOf(userId);
        console.log('index: ', index);
        console.log('userId: ', typeof userId);
        console.log('post.likes: ', post.likes);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }
        post.save((err) => {
            cb(err)
        });
    });
};


var Post = mongoose.model('Post', postSchema);

module.exports = Post;
