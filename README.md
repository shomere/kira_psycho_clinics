KIRA PSYCHO CLINICS

🌟 Overview
Kira Psycho Clinics is a comprehensive digital mental health platform that provides accessible, secure, and professional therapy services. Our platform bridges the gap between patients seeking mental health support and licensed therapists, offering seamless appointment booking, real-time communication, and secure video sessions.

🎯 Key Features
Feature	Description	Status
🔐 Secure Authentication	JWT-based auth with role-based access (Patient/Therapist)	✅ Live
👥 Therapist Directory	Browse verified therapists with filters and specialties	✅ Live
📅 Appointment Booking	Easy scheduling with availability management	✅ Live
💬 Real-time Chat	Secure messaging between patients and therapists	✅ Live
🎥 Video Sessions	Integrated video calling for remote therapy	✅ Live
📱 Responsive Dashboard	Personalized dashboards for both user types	✅ Live
💳 Payment Integration	Secure payment processing (Stripe)
🚀 Live Demo
Frontend Application: https://kira-psycho-frontend.onrender.com

Backend API: https://kira-psycho-backend.onrender.com

API Health Check: https://kira-psycho-backend.onrender.com/api/health

🏗️ Architecture
text
kira_psycho_clinics/
├── 📁 frontend/                 # React Vite Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Main application pages
│   │   ├── context/           # React Context providers
│   │   ├── services/          # API service layer
│   │   └── styles/            # CSS and styling
│   └── package.json
├── 📁 backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── middleware/        # Custom middleware
│   │   ├── routes/            # API route handlers
│   │   └── utils/             # Helper functions
│   └── package.json
└── 📁 database/               # PostgreSQL schema & migrations
🛠️ Technology Stack
Frontend
React 18 - Modern UI library with hooks

Vite - Fast build tool and dev server

React Router - Client-side routing

Context API - State management

CSS3 - Custom styling with modern features

Socket.io Client - Real-time communication

Backend
Node.js - Runtime environment

Express.js - Web application framework

PostgreSQL - Relational database

JWT - JSON Web Tokens for authentication

Socket.io - WebSocket real-time communication

bcryptjs - Password hashing

CORS - Cross-origin resource sharing

Deployment & Infrastructure
Render - Cloud platform for hosting

PostgreSQL - Managed database

Environment Variables - Secure configuration

📋 Prerequisites
Before running this project locally, ensure you have:

Node.js 18.0 or higher

PostgreSQL 12 or higher

npm (Node package manager)

🚀 Quick Start
1. Clone the Repository
bash
git clone https://github.com/shomere/kira_psycho_clinics.git
cd kira_psycho_clinics
2. Backend Setup
bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
Backend will run on http://localhost:3000

3. Frontend Setup
bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
Frontend will run on http://localhost:5173

4. Database Setup
sql
-- Create database
CREATE DATABASE kira_psycho_clinics;

-- Create user (optional)
CREATE USER kira_user WITH PASSWORD 'kira_pass';
GRANT ALL PRIVILEGES ON DATABASE kira_psycho_clinics TO kira_user;
🔧 Configuration
Environment Variables
Backend (.env)

env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secure-jwt-secret
DATABASE_URL=postgresql://username:password@localhost:5432/kira_psycho_clinics
Frontend (.env)

env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
📖 API Documentation
Authentication Endpoints
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/me - Get current user profile

Therapist Endpoints
GET /api/therapists - Get all therapists

GET /api/therapists/:id - Get specific therapist

GET /api/specializations - Get available specializations

Appointment Endpoints
POST /api/appointments/book - Book new appointment

GET /api/appointments/user/:userId - Get user appointments

GET /api/appointments/therapist/:therapistId - Get therapist appointments

Availability Endpoints
GET /api/availability/:therapistId - Get therapist availability

POST /api/availability/slots - Add availability slots (therapists only)

👥 User Roles
Patient Features
Browse and search therapists

Book appointments

Real-time chat with therapists

Join video sessions

View appointment history

Personal journal (coming soon)

Therapist Features
Manage availability schedule

View patient appointments

Secure messaging with patients

Video session hosting

Patient progress tracking (coming soon)

🔒 Security Features
JWT Authentication - Secure token-based auth

Password Hashing - bcryptjs for secure password storage

CORS Protection - Configured cross-origin policies

Input Validation - Server-side validation

SQL Injection Prevention - Parameterized queries

HTTPS Enforcement - In production environment

🧪 Testing
bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
🚀 Deployment
Backend Deployment (Render)
Connect GitHub repository to Render

Set environment variables in Render dashboard

Automatic deployments on git push

Frontend Deployment (Render)
Create Static Site service on Render

Set build command: npm run build

Set publish directory: dist

🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow React best practices

Write meaningful commit messages

Test your changes thoroughly

Update documentation as needed

📞 Support
If you need help with:

Technical issues: Create an issue on GitHub

Feature requests: Use the GitHub issues template

Security concerns: Email security@kirapsychoclinics.com

🏥 Our Mission
At Kira Psycho Clinics, we believe mental health care should be accessible, affordable, and effective. Our platform is designed to break down barriers to mental health support and create meaningful connections between those seeking help and qualified professionals.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
React community for excellent documentation

Render for seamless deployment hosting

PostgreSQL team for robust database solutions

All contributors and testers who helped shape this platform

Built with ❤️ for better mental health access

If you or someone you know is experiencing a mental health crisis, please contact your local emergency services or crisis hotline immediately.
