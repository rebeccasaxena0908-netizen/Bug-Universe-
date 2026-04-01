const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  severity:    { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  status:      { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Verified', 'Closed'], default: 'Open' },
  created_by:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  tags:        [{ type: String }],
  activity:    [{
    action:    String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Bug', bugSchema);