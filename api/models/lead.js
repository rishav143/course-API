const mongoose = require('mongoose');

const leadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
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
