const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  // lead_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Lead' // Reference the Lead model
  // },
  // instructor_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Instructor'
  // },
  comment_text: String, 
  _id: mongoose.Schema.Types.ObjectId,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);
