import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Kira Psycho Clinics API is running!',
    timestamp: new Date().toISOString()
  });
});

// Basic auth test endpoint
app.post('/api/test-auth', (req, res) => {
  const { email, password } = req.body;
  res.json({ 
    message: 'Auth endpoint working!',
    received: { email, password: '***' }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Kira Psycho Clinics backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
