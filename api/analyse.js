const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const payload = JSON.stringify({ model: 'claude-opus-4-6', max_tokens: 1000, messages: req.body.messages });
  const result = await new Promise((resolve, reject) => {
    const r = https.request({ hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'Content-Length': Buffer.byteLength(payload) }}, (response) => { let data = ''; response.on('data', c => data += c); response.on('end', () => resolve(data)); });
    r.on('error', reject); r.write(payload); r.end();
    });
    res.status(200).send(result);
  };
