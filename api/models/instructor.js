const mongoose = require('mongoose');

const instructorSchema = mongoose.Schema({
    instructor_id: mongoose.Types.ObjectId,
    name: String,
    email:  String,
    phone: Number,
    skills: [String],
    education: [{
        institution: String,
        degree: String,
        fieldOfStudy: String,
        completionDate: Date
    }]
});

module.exports = mongoose.model('Instructor', leadSchema);