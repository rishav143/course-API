const express = require('express');
const router = express();

router.post('/', (req, res, next) => {
    res.status(201).json({
        message : 'course created sucessfully'
    });
});

router.post('/:courseId/register', (req, res, next) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        linkden: req.body.linkden
    }
    res.status(200).json({
        message : 'course registered sucessfully',
        userDetails: user,
        id : req.params.courseId
    });
});

router.patch('/:courseId', (req, res, next) => {
    const update = {
        name: req.body.name,
        max_seat: req.body.max_seat,
        start_date: req.body.start_date
    }
    res.status(200).json({
        message : 'course updated sucessfully',
        id : req.params.courseId,
        updateDetails: update
    });
});

module.exports = router;