import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'test-secret';

app.use(express.json());

// Test JWT
app.get('/api/test-jwt', (req, res) => {
  const token = jwt.sign({ userId: 'test' }, JWT_SECRET);
  res.json({ token: token });
});

// Test basic server
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log('Simple server running on port ' + PORT);
});
