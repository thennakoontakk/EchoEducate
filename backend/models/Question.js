const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [String], // for MCQ (optional)
  type: { type: String, enum: ['mcq', 'text'], required: true }, // 'text' for open-ended
  answer: { type: String }, // for MCQ (optional)
});

module.exports = mongoose.model('Question', questionSchema);
