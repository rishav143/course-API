const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor'
  },
  name: String,
  max_seats: Number, 
  start_date: Date
});

module.exports = mongoose.model('Course', courseSchema);
