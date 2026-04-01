const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  bug_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Bug', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  replies: [{
    user_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment:   String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);