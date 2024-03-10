const mongoose = require('mongoose');

const leadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email:  String,
    phone: Number,
    linkedin_profile: String,
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Waitlist']
    },
    // course_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Course'
    // }
});

module.exports = mongoose.model('Lead', leadSchema);
