const express = require('express');
const router = express();
const mongoose = require('mongoose');

const Instructor = require('../models/instructor');

// new instructor registration
router.post('/', async (req, res, next) => {
    try {
        // Validate required fields
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            throw new Error('Missing required instructor data (name, email, phone)');
        }

        //validate email id
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        // Create a new instructor 
        const newId = new mongoose.Types.ObjectId();
        const newInstructor = new Instructor({
            _id: newId,
            name,
            email,
            phone: Number(req.body.phone),
            skills: req.body.skills || [],
            education: req.body.education || [],
        });

        // Save the instructor and send a successful response
        const savedInstructor = await newInstructor.save();

        res.status(200).json({
            message: 'Instructor registered successfully',
            instructor: savedInstructor,
            request: {
                type: 'GET',
                url: `http://localhost:3000/instructors/${newId}`,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

// get instructor details by id
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

// update instructor details by id
router.patch('/:instructorId', async (req, res, next) => {
    try {
        const id = req.params.instructorId;

        // Find the instructor by ID
        const instructor = await Instructor.findById(id).exec();

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        const { name, email, phone, skills, education } = req.body;
        const updates = {};

        // Update specific fields if provided in the request body
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (phone) updates.phone = phone;
        if (skills) updates.skills = skills; 
        if (education) updates.education = education; 

        // Update the instructor with the modified data
        const updatedInstructor = await Instructor.findByIdAndUpdate(id, updates, { new: true }).exec();

        res.status(200).json({
            message: 'Instructor updated',
            instructor: updatedInstructor,
            request: {
                type: 'GET',
                url: `http://localhost:3000/instructors/${id}`, 
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during update' });
    }
});


module.exports = router;
