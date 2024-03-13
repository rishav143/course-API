const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead', // Reference the Lead model
    required: true
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true
  },
  comment_text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);
