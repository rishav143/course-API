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

router.post('/', upload.single('courseImage'), async (req, res, next) => {
    // 1. Validate Image Upload
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    // 2. Validate Course Data (including instructor ID)
    try {
        const { name, max_seats, start_date, instructorId } = req.body;

        if (!name || !max_seats || !start_date || !instructorId) {
            throw new Error('Missing required course data (name, max_seats, start_date, instructorId)');
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

        // **Instructor ID Validation (replace with your logic):**
        // - Fetch instructor data using instructorId
        // - Check if instructor exists and is active
        // - Throw an error if validation fails

        const instructor = await Instructor.findById(instructorId);
        if (!instructor || !instructor.isActive) {
            throw new Error('Invalid or inactive instructor ID');
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }

    // 3. Create and Save New Course Instance
    const newCourse = new Course({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        max_seats: Number(req.body.max_seats),
        start_date: new Date(req.body.start_date),
        courseImage: req.file.path,
        instructor: instructorId 
    });

    try {
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
        res.status(500).json({ error: 'Failed to create course' });
    }
});



router.post('/:courseId/register', async (req, res, next) => {
    try {
        // Validate course ID
        const courseId = req.params.courseId;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }

        // Create new lead
        const newId = new mongoose.Types.ObjectId();
        const newStudent = new Lead({
            _id: newId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            linkedin_profile: req.body.linkedin_profile,
            status: 'Pending',
        });

        // Save lead and send response
        const result = await newStudent.save();
        console.log(result);

        res.status(200).json({
            message: 'Student registered successfully',
            request: {
                type: 'GET',
                url: `https://localhost:3000/leads/${newId}`,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.patch('/:courseId', (req, res, next) => {
    const id = req.params.courseId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Course.updateMany({ _id: id }, { $set: updateOps })
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