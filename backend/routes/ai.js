const express = require('express');
const router  = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert code reviewer. Analyze this code and return ONLY a JSON array of issues. Each item must have: "level" (critical/warning/info), "title" (max 5 words), "desc" (1-2 sentences), "line" (line number, optional). Return ONLY valid JSON array, no markdown, no backticks.\n\nCode:\n${code}`
            }]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const clean = text.replace(/```json|```/g, '').trim();

    let suggestions = [];
    try {
      suggestions = JSON.parse(clean);
    } catch (e) {
      const match = clean.match(/\[[\s\S]*\]/);
      if (match) suggestions = JSON.parse(match[0]);
    }

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
