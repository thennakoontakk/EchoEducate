const express = require('express');
const Answer = require('../models/Answer');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Submit answer
router.post('/', verifyToken, async (req, res) => {
  const { questionId, paperId, answerText } = req.body;

  try {
    // Prevent duplicate answers
    const existing = await Answer.findOne({ questionId, paperId, userId: req.user.id });
    if (existing) return res.status(400).json({ error: 'Already answered' });

    const answer = new Answer({ questionId, paperId, userId: req.user.id, answerText });
    await answer.save();
    res.status(201).json({ message: 'Answer saved' });
  } catch (err) {
    res.status(500).json({ error: 'Answer failed' });
  }
});
// Fetch all answers
router.get('/', verifyToken, async (req, res) => {
  try {
    const answers = await Answer.find().populate('questionId').populate('paperId');
    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch answers' });
  }
});

// Fetch answers by paper ID
router.get('/paper/:paperId', verifyToken, async (req, res) => {
  try {
    const answers = await Answer.find({ paperId: req.params.paperId }).populate('questionId');
    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch answers for this paper' });
  }
});

module.exports = router;
