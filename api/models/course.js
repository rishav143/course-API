const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  // instructor_id: {
  //   id: mongoose.Schema.Types.ObjectId,
  //   ref: 'Instructor'
  // },
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  max_seats: Number, 
  start_date: Date
});

module.exports = mongoose.model('Course', courseSchema);