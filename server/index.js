const http = require('http'); // 1. Import the HTTP module

const HOSTNAME = '127.0.0.1';
const PORT = 5000; // 2. Define the port

// 3. Create the server instance
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

// 4. Start the server listener and log the port
server.listen(PORT, HOSTNAME, () => {
  // --- THIS IS WHERE THE PORT IS PRINTED ---
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
  // The terminal prompt will not return until you press Ctrl+C
});