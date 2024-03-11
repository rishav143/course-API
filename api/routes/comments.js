const express = require('express');
const router = express();

const Comment = require('../models/comment');
const Lead = require('../models/lead');
const Instructor = require('../models/instructor');

//instructor can post comment for lead
router.post('/', async (req, res, next) => {
    try {
        const { lead_id, instructor_id, comment_text } = req.body;

        // Validate required fields
        if (!lead_id || !instructor_id || !comment_text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check lead and instructor existence
        const [lead, instructor] = await Promise.all([
            Lead.findById(lead_id),
            Instructor.findById(instructor_id),
        ]);

        if (!lead || !instructor) {
            return res.status(404).json({ error: 'Please sign up if not already registered.' });
        }

        const newComment = new Comment({
            lead_id,
            instructor_id,
            comment_text,
        });

        const savedComment = await newComment.save();

        res.status(200).json({
            status: 'comment added successfully',
            comment: savedComment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating comment' });
    }
});

module.exports = router;