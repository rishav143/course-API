const mongoose = require('mongoose');

const instructorSchema = mongoose.Schema({
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
    skill: String,
    education: String
});

module.exports = mongoose.model('Instructor', instructorSchema);