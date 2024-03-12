const express = require('express');
const router = express();

const Lead = require('../models/lead');
const Instructor = require('../models/instructor');

// instructor can change lead status
router.patch('/', async (req, res, next) => {
    try {
        const { status, lead_id, instructor_id } = req.body;

        // validate instructor detail
        const instructor = await Instructor.findById(instructor_id).exec();
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        
        //validate lead details
        const lead = await Lead.findById(lead_id).exec();
        if (!lead && !status) {
            return res.status(404).json({ message: 'Lead details required' });
        }

        //update lead details
        const updates = {};
        updates.status = status;
        updates.lead_id = lead_id;

        // Update the instructor with the modified data
        const updatedLead = await Lead.findByIdAndUpdate(lead_id, updates, { new: true }).exec();

        res.status(200).json({
            message: 'Lead updated',
            instructor_id: instructor_id,
            lead: updatedLead,
            request: {
                type: 'GET',
                url: `http://localhost:3000/leads/${lead_id}`, 
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during update' });
    }
});

const mongoose = require('mongoose');

// get lead by id
router.get('/:leadId', async (req, res, next) => {
    const id = req.params.leadId;

    // Validate if the provided ID is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid lead ID' });
    }

    try {
        const result = await Lead.findById(id).exec();

        console.log(result);
        if (result) {
            res.status(200).json({
                message: 'Lead found successfully',
                lead: result
            });
        } else {
            res.status(404).json({ message: 'No valid entry found for provided ID' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


//lead can update their details
router.patch('/:leadId', async (req, res, next) => {
    try {
        // Find the lead by ID
        const lead_id = req.params.leadId;
        const lead = await Lead.findById(lead_id).exec();
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        const { name, email, phone, linkedin_profile } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (email) updates.email = email;
        if (phone) updates.phone = phone;
        if (linkedin_profile) updates.linkedin_profile = linkedin_profile;

        // Update the Lead with the modified data
        const updatedLead= await Lead.findByIdAndUpdate(lead_id, updates, { new: true }).exec();

        res.status(200).json({
            message: 'Lead updated',
            Lead: updatedLead,
            request: {
                type: 'GET',
                url: `http://localhost:3000/leads/${lead_id}`,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during update' });
    }
});

module.exports = router;
