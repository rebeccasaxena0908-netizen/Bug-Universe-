const express = require('express');
const router  = express.Router();
const Bug     = require('../models/Bug');

// Smart severity auto-suggest based on description
function autoSeverity(description) {
  const d = description.toLowerCase();
  if (d.includes('crash') || d.includes('security') || d.includes('vulnerability') || d.includes('injection') || d.includes('export')) return 'Critical';
  if (d.includes('error') || d.includes('fail') || d.includes('broken') || d.includes('freeze') || d.includes('upload') || d.includes('500')) return 'High';
  if (d.includes('slow') || d.includes('performance') || d.includes('delay') || d.includes('rendering') || d.includes('count') || d.includes('badge')) return 'Medium';
  return 'Low';
}

// GET dashboard stats — must be BEFORE /:id route
router.get('/stats/overview', async (req, res) => {
  try {
    const total    = await Bug.countDocuments();
    const open     = await Bug.countDocuments({ status: 'Open' });
    const resolved = await Bug.countDocuments({ status: 'Resolved' });
    const critical = await Bug.countDocuments({ severity: 'Critical' });
    const high     = await Bug.countDocuments({ severity: 'High' });
    const medium   = await Bug.countDocuments({ severity: 'Medium' });
    const low      = await Bug.countDocuments({ severity: 'Low' });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const trend = await Bug.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ total, open, resolved, critical, high, medium, low, trend });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all bugs (with filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.tag)      filter.tags      = req.query.tag;
    if (req.query.search) {
      filter.$or = [
        { title:       { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const bugs = await Bug.find(filter)
      .populate('created_by',  'name email')
      .populate('assigned_to', 'name email')
      .sort({ createdAt: -1 });

    res.json(bugs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single bug
router.get('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('created_by',  'name email')
      .populate('assigned_to', 'name email');
    if (!bug) return res.status(404).json({ error: 'Bug not found' });
    res.json(bug);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create bug
router.post('/', async (req, res) => {
  try {
    const { title, description, severity, status, created_by, assigned_to, tags } = req.body;

    const finalSeverity = severity || autoSeverity(description);

    const bug = await Bug.create({
      title,
      description,
      severity:    finalSeverity,
      status:      status || 'Open',
      created_by,
      assigned_to: assigned_to || null,
      tags:        tags || [],
      activity:    [{ action: `Bug created with status: Open` }]
    });

    res.status(201).json(bug);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update bug
router.put('/:id', async (req, res) => {
  try {
    const { status, assigned_to, severity, title, description, tags } = req.body;
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ error: 'Bug not found' });

    const activity = [];
    if (status   && status   !== bug.status)   activity.push({ action: `Status changed to: ${status}` });
    if (severity && severity !== bug.severity) activity.push({ action: `Severity updated to: ${severity}` });
    if (assigned_to && String(assigned_to) !== String(bug.assigned_to)) activity.push({ action: `Reassigned to new developer` });

    const updated = await Bug.findByIdAndUpdate(
      req.params.id,
      {
        ...(title       && { title }),
        ...(description && { description }),
        ...(severity    && { severity }),
        ...(status      && { status }),
        ...(assigned_to !== undefined && { assigned_to }),
        ...(tags        && { tags }),
        $push: { activity: { $each: activity } }
      },
      { new: true }
    ).populate('created_by', 'name email').populate('assigned_to', 'name email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE bug
router.delete('/:id', async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bug deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;