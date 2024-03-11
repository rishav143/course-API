const express = require('express');
const router = express(); 
const mongoose = require('mongoose');

const Instructor = require('../models/instructor');

router.get('/:instructorId', async (req, res, next) => {
    try {
        const id = req.params.instructorId;
        const instructor = await Instructor.findById(id).exec();

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        console.log(instructor);
        res.status(200).json({
            message: 'Instructor found successfully',
            instructor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', (req, res, next) => { 
    const newId = new mongoose.Types.ObjectId();
    const newInstructor = new Instructor({
        _id: newId,
        name: req.body.name,
        email: req.body.email,
        phone: Number(req.body.phone),
        skills: req.body.skills,
        education: req.body.education
    });

    newInstructor
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Instructor registered successfully',
                instructor: result,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/instructors/' + newId 
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


router.patch('/:instructorId', (req, res, next) => {
    const id = req.params.instructorId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Instructor.updateMany({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Instructor updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/instructors/' + id
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
