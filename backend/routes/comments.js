const express = require('express');
const router  = express.Router();
const Comment = require('../models/Comment');

// GET all comments for a bug
router.get('/:bug_id', async (req, res) => {
  try {
    const comments = await Comment.find({ bug_id: req.params.bug_id })
      .populate('user_id',         'name email role')
      .populate('replies.user_id', 'name email role')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add comment
router.post('/', async (req, res) => {
  try {
    const { bug_id, user_id, comment } = req.body;
    const newComment = await Comment.create({ bug_id, user_id, comment });
    const populated  = await newComment.populate('user_id', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add reply to comment
router.post('/:comment_id/reply', async (req, res) => {
  try {
    const { user_id, comment } = req.body;
    const parent = await Comment.findByIdAndUpdate(
      req.params.comment_id,
      { $push: { replies: { user_id, comment } } },
      { new: true }
    ).populate('user_id', 'name email').populate('replies.user_id', 'name email');
    res.json(parent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;