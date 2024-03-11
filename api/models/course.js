const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  instructor_id: {
    id: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor'
  },
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  max_seats: {
    type: Number,
    required: true
  }, 
  start_date: {
    type: Date,
    required: true
  },
  courseImage: { 
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Course', courseSchema);