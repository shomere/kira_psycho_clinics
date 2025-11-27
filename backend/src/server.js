import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
const { Pool } = pkg;
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'kira-psycho-clinics-super-secret-2024';

// Database connection - ONLY ONCE!
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://kira_user:kira_pass@localhost:5432/kira_psycho_clinics',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create HTTP server for Socket.io
const server = createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://your-frontend-app.onrender.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room for specific user
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room user-${userId}`);
  });

  // Join room for specific therapist
  socket.on('join-therapist-room', (therapistId) => {
    socket.join(`therapist-${therapistId}`);
    console.log(`Therapist ${therapistId} joined room therapist-${therapistId}`);
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    const { to, message, from } = data;
    // Broadcast to specific user/therapist room
    socket.to(`user-${to}`).to(`therapist-${to}`).emit('receive-message', {
      from,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Handle video call requests
  socket.on('video-call-request', (data) => {
    const { to, from, callType } = data;
    socket.to(`user-${to}`).to(`therapist-${to}`).emit('incoming-call', {
      from,
      callType,
      callId: Math.random().toString(36).substring(7)
    });
  });

  // Handle call acceptance
  socket.on('call-accepted', (data) => {
    const { to, callId } = data;
    socket.to(`user-${to}`).to(`therapist-${to}`).emit('call-established', {
      callId,
      established: true
    });
  });

  // Handle call rejection
  socket.on('call-rejected', (data) => {
    const { to } = data;
    socket.to(`user-${to}`).to(`therapist-${to}`).emit('call-ended', {
      reason: 'rejected'
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// CORS configuration - ONLY ONCE!
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://your-frontend-app.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Kira Psycho Clinics API is running!',
    timestamp: new Date().toISOString()
  });
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, user_type } = req.body;

    console.log('Registration attempt:', { email, user_type });

    // Basic validation
    if (!email || !password || !user_type) {
      return res.status(400).json({ error: 'Email, password, and user type are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!['patient', 'therapist'].includes(user_type)) {
      return res.status(400).json({ error: 'User type must be either patient or therapist' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, user_type) VALUES ($1, $2, $3) RETURNING user_id, email, user_type, date_registered, status',
      [email, password_hash, user_type]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        email: user.email, 
        userType: user.user_type 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('User registered successfully:', user.email);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: user.user_id,
        email: user.email,
        user_type: user.user_type,
        date_registered: user.date_registered,
        status: user.status
      },
      token: token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE user_id = $1',
      [user.user_id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        email: user.email, 
        userType: user.user_type 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful:', user.email);

    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        user_type: user.user_type,
        status: user.status,
        last_login: new Date().toISOString()
      },
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile (protected route)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT user_id, email, user_type, status, date_registered, last_login FROM users WHERE user_id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    res.json({
      user: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (protected route)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, email, user_type, status, date_registered FROM users');
    res.json({
      users: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Test JWT endpoint
app.get('/api/test-jwt', (req, res) => {
  const token = jwt.sign({ test: 'JWT is working!' }, JWT_SECRET);
  res.json({ 
    message: 'JWT test successful',
    token: token 
  });
});

// Get all therapists (for directory)
app.get('/api/therapists', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.user_id, u.email, u.bio, u.qualifications, u.hourly_rate, u.is_verified,
             array_agg(s.name) as specializations
      FROM users u
      LEFT JOIN therapist_specializations ts ON u.user_id = ts.therapist_id
      LEFT JOIN specializations s ON ts.specialization_id = s.specialization_id
      WHERE u.user_type = 'therapist'
      GROUP BY u.user_id
    `);
    res.json({
      therapists: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get therapists error:', error);
    res.status(500).json({ error: 'Failed to fetch therapists' });
  }
});

// Get therapist availability
app.get('/api/availability/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params;
    const result = await pool.query(
      'SELECT * FROM availability_slots WHERE therapist_id = $1 AND start_time > NOW() ORDER BY start_time',
      [therapistId]
    );
    res.json({ availability: result.rows });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Add availability slots (therapists only)
app.post('/api/availability/slots', authenticateToken, async (req, res) => {
  try {
    const { start_time, end_time, is_recurring, recurrence_pattern } = req.body;
    const therapistId = req.user.userId;

    // Check if user is a therapist
    const userResult = await pool.query(
      'SELECT user_type FROM users WHERE user_id = $1',
      [therapistId]
    );

    if (userResult.rows[0].user_type !== 'therapist') {
      return res.status(403).json({ error: 'Only therapists can add availability' });
    }

    const result = await pool.query(
      'INSERT INTO availability_slots (therapist_id, start_time, end_time, is_recurring, recurrence_pattern) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [therapistId, start_time, end_time, is_recurring, recurrence_pattern]
    );

    res.status(201).json({
      message: 'Availability slot added successfully',
      slot: result.rows[0]
    });
  } catch (error) {
    console.error('Add availability error:', error);
    res.status(500).json({ error: 'Failed to add availability slot' });
  }
});

// Book an appointment
app.post('/api/appointments/book', authenticateToken, async (req, res) => {
  try {
    const { therapist_id, scheduled_time, duration_minutes, session_type, agenda } = req.body;
    const patientId = req.user.userId;

    // Check if therapist exists and is available
    const therapistResult = await pool.query(
      'SELECT user_id FROM users WHERE user_id = $1 AND user_type = $2',
      [therapist_id, 'therapist']
    );

    if (therapistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    // Check for scheduling conflicts
    const conflictResult = await pool.query(
      `SELECT appointment_id FROM appointments
       WHERE therapist_id = $1 AND scheduled_time = $2
       AND status IN ('scheduled', 'confirmed')`,
      [therapist_id, scheduled_time]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ error: 'Therapist is not available at this time' });
    }

    // Create appointment
    const result = await pool.query(
      `INSERT INTO appointments
       (patient_id, therapist_id, scheduled_time, duration_minutes, session_type, agenda)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [patientId, therapist_id, scheduled_time, duration_minutes, session_type, agenda]
    );

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: result.rows[0]
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Get user appointments
app.get('/api/appointments/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify the user can only access their own appointments
    if (req.user.userId !== userId && req.user.userType !== 'therapist') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT a.*,
              pt.email as patient_email,
              th.email as therapist_email,
              th.bio as therapist_bio
       FROM appointments a
       JOIN users pt ON a.patient_id = pt.user_id
       JOIN users th ON a.therapist_id = th.user_id
       WHERE a.patient_id = $1
       ORDER BY a.scheduled_time DESC`,
      [userId]
    );

    res.json({ appointments: result.rows });
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get therapist appointments
app.get('/api/appointments/therapist/:therapistId', authenticateToken, async (req, res) => {
  try {
    const { therapistId } = req.params;

    // Verify the therapist can only access their own appointments
    if (req.user.userId !== therapistId && req.user.userType !== 'patient') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT a.*,
              pt.email as patient_email,
              pt.date_of_birth as patient_dob
       FROM appointments a
       JOIN users pt ON a.patient_id = pt.user_id
       WHERE a.therapist_id = $1
       ORDER BY a.scheduled_time DESC`,
      [therapistId]
    );

    res.json({ appointments: result.rows });
  } catch (error) {
    console.error('Get therapist appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get all specializations
app.get('/api/specializations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM specializations ORDER BY name');
    res.json({ specializations: result.rows });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ error: 'Failed to fetch specializations' });
  }
});

// Change from app.listen to server.listen
server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Kira Psycho Clinics backend running on port ' + PORT);
  console.log('📍 Health: http://localhost:' + PORT + '/api/health');
  console.log('📍 Register: POST http://localhost:' + PORT + '/api/auth/register');
  console.log('📍 Login: POST http://localhost:' + PORT + '/api/auth/login');
  console.log('📍 Profile: GET http://localhost:' + PORT + '/api/auth/me (protected)');
  console.log('📍 Users: GET http://localhost:' + PORT + '/api/users (protected)');
  console.log('📍 Therapists: GET http://localhost:' + PORT + '/api/therapists');
  console.log('📍 Appointments: POST http://localhost:' + PORT + '/api/appointments/book (protected)');
  console.log('📍 Availability: GET http://localhost:' + PORT + '/api/availability/:therapistId');
  console.log('📍 JWT Test: GET http://localhost:' + PORT + '/api/test-jwt');
  console.log('🔌 Socket.io is running on the same port');
});