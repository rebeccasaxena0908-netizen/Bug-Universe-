const express = require('express');
const router  = express.Router();
const Bug     = require('../models/Bug');

// GET all unique tags in use
router.get('/', async (req, res) => {
  try {
    const tags = await Bug.distinct('tags');
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;