// server/index.js

// You can keep the import if you need utility functions from 'http', 
// but for a basic response, you don't even need it.
module.exports = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World from Vercel Node.js!\n');
};