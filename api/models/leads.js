const mongoose = require('mongoose');

const leadSchema = mongoose.Schema({
    lead_id: mongoose.Types.ObjectId,
    name: String,
    email:  String,
    phone: Number,
    linkedin_profile: String,
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Waitlist']
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
});

module.exports = mongoose.model('Lead', leadSchema);
