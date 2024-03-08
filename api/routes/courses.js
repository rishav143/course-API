const express = require('express');
const router = express();

router.post('/', (req, res, next) => {
    res.status(201).json({
        message : 'course created sucessfully'
    });
});

router.post('/:courseId/register', (req, res, next) => {
    res.status(200).json({
        message : 'course registered sucessfully',
        id : req.params.courseId
    });
});

router.patch('/:courseId', (req, res, next) => {
    res.status(200).json({
        message : 'course updated sucessfully',
        id : req.params.courseId
    });
});

module.exports = router;