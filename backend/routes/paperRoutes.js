const express = require('express');
const Paper = require('../models/Paper');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Get all papers
router.get('/', verifyToken, async (req, res) => {
  try {
    const papers = await Paper.find().populate('questions');
    res.status(200).json(papers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

// Get a single paper by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('questions');
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.status(200).json(paper);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
});

// Create a new paper
router.post('/', verifyToken, async (req, res) => {
  const { title, description, questions } = req.body;

  try {
    const newPaper = new Paper({ title, description, questions });
    await newPaper.save();
    res.status(201).json({ message: 'Paper created', paper: newPaper });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create paper' });
  }
});

// Update a paper
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, questions } = req.body;

  try {
    const updatedPaper = await Paper.findByIdAndUpdate(
      id, 
      { title, description, questions, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedPaper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    res.status(200).json({ message: 'Paper updated', paper: updatedPaper });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update paper' });
  }
});

// Delete a paper
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPaper = await Paper.findByIdAndDelete(id);
    
    if (!deletedPaper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    res.status(200).json({ message: 'Paper deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete paper' });
  }
});

// Add a question to a paper
router.post('/:id/questions', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { questionId } = req.body;

  try {
    const paper = await Paper.findById(id);
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    if (!paper.questions.includes(questionId)) {
      paper.questions.push(questionId);
      paper.updatedAt = Date.now();
      await paper.save();
    }
    
    res.status(200).json({ message: 'Question added to paper' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add question to paper' });
  }
});

// Remove a question from a paper
router.delete('/:id/questions/:questionId', verifyToken, async (req, res) => {
  const { id, questionId } = req.params;

  try {
    const paper = await Paper.findById(id);
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    paper.questions = paper.questions.filter(q => q.toString() !== questionId);
    paper.updatedAt = Date.now();
    await paper.save();
    
    res.status(200).json({ message: 'Question removed from paper' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove question from paper' });
  }
});

module.exports = router;