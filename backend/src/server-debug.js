import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Add error handling to all routes
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

app.get('/api/health', (req, res) => {
  console.log('Health check called');
  res.json({ status: 'OK', message: 'Debug server working' });
});

// Test database connection (simplified)
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Testing database connection');
    // Just return success without actual DB call
    res.json({ message: 'Database would connect here' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('Debug server running on port ' + PORT);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
