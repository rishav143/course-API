const express = require('express');
const router = express();

const Comment = require('../models/comment');
const { default: mongoose } = require('mongoose');

router.post('/', (req, res, next) => {
    const newComment = new Comment({
        _id: new mongoose.Types.ObjectId,
        message: req.body.message,
        createdAt: new Date()
    });
    
    newComment
        .save()
        .then(result => {
            console.log(result),
            res.status(200).json({
                status: 'comment added successfully',
                comment: newComment
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;