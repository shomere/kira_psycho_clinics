import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Minimal server working' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Minimal server running on port ' + PORT);
});
