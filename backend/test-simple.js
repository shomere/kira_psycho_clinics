const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Received request:', req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'IT WORKS!', url: req.url }));
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Simple HTTP server running on port 3000');
});

console.log('Server started successfully');
