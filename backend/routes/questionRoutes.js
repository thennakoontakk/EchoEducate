const express = require('express');
const Question = require('../models/Question');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Get all questions
router.get('/', verifyToken, async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Update a question
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { text, type, options, answer } = req.body;

  try {
    await Question.findByIdAndUpdate(id, { text, type, options, answer });
    res.status(200).json({ message: 'Question updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete a question
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// Create a new question
router.post('/', verifyToken, async (req, res) => {
  const { text, type, options, answer } = req.body;

  try {
    const newQuestion = new Question({ text, type, options, answer });
    await newQuestion.save();
    res.status(201).json({ message: 'Question created', question: newQuestion });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create question' });
  }
});

module.exports = router;
