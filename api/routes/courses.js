const express = require('express');
const router = express();
const mongoose = require('mongoose');
const multer = require('multer'); // for dealing with files
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage, fileFilter: filterImages });

// Function to filter images based on extension
function filterImages(req, file, cb) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid image format. Only JPG, JPEG, and PNG allowed'), false);
    }
}

const Course = require('../models/course');
const Lead = require('../models/lead');
const Instructor = require('../models/instructor');

router.get('/:courseId', (req, res, next) => {
    const id = req.params.courseId;
    Course.findById(id)
        .select('name max_seats start_date _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/', upload.single('course_image'), async (req, res, next) => {
    // Validate Image Upload
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    try {

        // validate course data
        const { name, max_seats, start_date, instructor_id } = req.body;

        if (!name || !max_seats || !start_date || !instructor_id) {
            throw new Error('Missing required course data (name, max_seats, start_date, instructor_id)');
        }

        const maxSeatsNumber = Number(max_seats);
        if (isNaN(maxSeatsNumber)) {
            throw new Error('max_seats must be a number');
        }

        if (maxSeatsNumber <= 0) {
            throw new Error('max_seats must be a positive number');
        }

        const startDate = new Date(start_date);
        if (isNaN(startDate.getTime())) {
            throw new Error('Invalid start_date format (YYYY-MM-DD)');
        }

        //validate instructor id in existing database
        const instructor = await Instructor.findById(instructor_id);
        if (!instructor) {
            throw new Error('Invalid instructor ID');
        }

        // Create and Save New Course Instance
        const newCourse = new Course({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            max_seats: Number(req.body.max_seats),
            start_date: new Date(req.body.start_date),
            course_image: req.file.path,
            instructor
        });

        const savedCourse = await newCourse.save();
        console.log(savedCourse);

        res.status(201).json({
            message: 'Course created successfully',
            createdCourse: {
                name: savedCourse.name,
                max_seats: savedCourse.max_seats,
                start_date: savedCourse.start_date,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/courses/${savedCourse._id}`
                }
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
});


router.post('/:courseId', async (req, res, next) => {
    try {
        // Validate course ID in existing database
        const courseId = req.params.courseId;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        //validate the email id
        const email = req.body.email;
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        //validate linkedin profile
        const linkedin_id = req.body.linkedin_profile;
        function isLinkedInUrl(url) {
            const linkedInRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([^\s]*)?$/;
            return linkedInRegex.test(url);
        }
        if (!isLinkedInUrl(linkedin_id)) {
            return res.status(400).json({ error: 'Invalid linkedin url' });
        }

        // Create new lead
        const newId = new mongoose.Types.ObjectId();
        const newStudent = new Lead({
            _id: newId,
            name: req.body.name,
            email: email,
            phone: req.body.phone,
            linkedin_profile: linkedin_id,
            status: 'Pending',
        });

        // Save lead and send response
        const result = await newStudent.save();
        console.log(result);

        res.status(200).json({
            message: 'Student registered successfully',
            request: {
                type: 'GET',
                url: `http://localhost:3000/leads/${newId}`,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.patch('/:courseId', upload.single('course_image'), async (req, res, next) => {
    try {
        const id = req.params.courseId;

        // Validate course ID
        const course = await Course.findById(id).exec();
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const { name, max_seats, start_date } = req.body;
        const imgPath = req.file.path;
        const updates = {};

        // Update specific fields
        if (name) updates.name = name;
        if (max_seats) updates.max_seats = max_seats;
        if (start_date) updates.start_date = start_date;
        if (imgPath) updates.course_image = imgPath;

        const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true }).exec();

        res.status(200).json({
            message: 'Course updated successfully',
            course: updatedCourse,
            request: {
                type: 'GET',
                url: `http://localhost:3000/courses/${id}`,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;