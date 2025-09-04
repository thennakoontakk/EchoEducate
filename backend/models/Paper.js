const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
paperSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Paper', paperSchema);