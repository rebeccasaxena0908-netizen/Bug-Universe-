const BASE = 'http://localhost:3001/api';

export const api = {
  // Bugs
  getBugs:    (params = {}) => fetch(`${BASE}/bugs?${new URLSearchParams(params)}`).then(r => r.json()),
  getBug:     (id)          => fetch(`${BASE}/bugs/${id}`).then(r => r.json()),
  createBug:  (data)        => fetch(`${BASE}/bugs`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  updateBug:  (id, data)    => fetch(`${BASE}/bugs/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  deleteBug:  (id)          => fetch(`${BASE}/bugs/${id}`, { method: 'DELETE' }).then(r => r.json()),
  getStats:   ()            => fetch(`${BASE}/bugs/stats/overview`).then(r => r.json()),

  // Comments
  getComments:  (bugId)           => fetch(`${BASE}/comments/${bugId}`).then(r => r.json()),
  addComment:   (data)            => fetch(`${BASE}/comments`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  addReply:     (commentId, data) => fetch(`${BASE}/comments/${commentId}/reply`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),

  // Users
  getUsers:  ()     => fetch(`${BASE}/users`).then(r => r.json()),
  login:     (data) => fetch(`${BASE}/users/login`,    { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  register:  (data) => fetch(`${BASE}/users/register`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),

  // Tags
  getTags: () => fetch(`${BASE}/tags`).then(r => r.json()),

  // AI Code Analysis
  analyzeCode: (code) => fetch(`${BASE}/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  }).then(r => r.json()),
};