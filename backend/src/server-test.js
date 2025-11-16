import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server working' });
});

// Simple therapists endpoint without complex SQL
app.get('/api/therapists-simple', async (req, res) => {
  try {
    res.json({ 
      message: 'Simple therapists endpoint working',
      therapists: []
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Simple endpoint failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Test server running on port ' + PORT);
});
