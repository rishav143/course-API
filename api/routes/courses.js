const express = require('express');
const router = express();
const mongoose = require('mongoose');

const Course = require('../models/course');
const Lead = require('../models/lead')

router.get('/:courseId', (req, res, next) => {
    const id = req.params.courseId;
    Course.findById(id)
        .select('name max_seats start_date _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.post('/', (req, res, next) => {
    // Create new course instance
    const newCourse = new Course({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        max_seats: Number(req.body.max_seats),
        start_date: new Date(req.body.start_date)
    });

    // Save the course and send response after successful save
    newCourse
        .save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: 'course created successfully',
                createdCourse: {
                    name: result.name,
                    max_seats: result.max_seats,
                    start_date: result.start_date,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/courses/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.post('/:courseId/register', (req, res, next) => {
    const newId = new mongoose.Types.ObjectId;
    const newStudent = new Lead({
        _id: newId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        linkedin_profile: req.body.linkedin_profile,
        status: 'Pending'
    });

    newStudent
        .save()
        .then(result => {
            console.log(result),
            res.status(200).json({
                message: 'student registered successfully',
                request: {
                    type: 'GET',
                    url: "https//localhost:3000/leads/" + newId
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:courseId', (req, res, next) => {
    const id = req.params.courseId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Course.updateMany({ _id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Course updated',
                request: {
                    type: 'GET',
                    url: 'https://localhost:3000/courses/' + id
                }
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